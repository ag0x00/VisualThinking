// Ink-in-water spike — Stable Fluids (Stam 1999) on Metal compute shaders.
// Self-running: autonomous emitters splat dye + velocity, so it needs no input
// (screensaver-shaped). Single file; the .metal source is compiled at runtime,
// so there is no Xcode project and no .metallib build step — just `./build.sh`.
//
// Pipeline per frame (GPU Gems 38 / Stam): advect velocity -> add forces (splat)
// -> project (divergence, Jacobi pressure, subtract gradient) -> advect dye.
//
// ponytail: no vorticity confinement, no diffusion pass, fixed square grid,
//   cheap mix() compositing instead of Kubelka-Munk. Upgrade paths noted inline.
//   See wiki: [[Stable Fluids and GPU Ink Advection]], [[Kubelka-Munk Optical Compositing]].

import Cocoa
import MetalKit
import simd

let GRID = 384           // simulation resolution (square)
let PRESSURE_ITERS = 30  // Jacobi iterations for the pressure Poisson solve
let DT: Float = 1.0      // Stable Fluids is unconditionally stable; dt in grid cells

// MARK: - Shaders (compiled at runtime)

let shaderSource = """
#include <metal_stdlib>
using namespace metal;

constexpr sampler samp(coord::normalized, address::clamp_to_edge, filter::linear);

static inline int2 clampc(int2 p, int w, int h) {
    return int2(clamp(p.x, 0, w-1), clamp(p.y, 0, h-1));
}

// Semi-Lagrangian advection of `src` along `vel`. Used for velocity and dye.
kernel void advect(texture2d<float, access::sample> src [[texture(0)]],
                   texture2d<float, access::sample> vel [[texture(1)]],
                   texture2d<float, access::write>  dst [[texture(2)]],
                   constant float& dt          [[buffer(0)]],
                   constant float& dissipation [[buffer(1)]],
                   uint2 gid [[thread_position_in_grid]]) {
    uint w = src.get_width(), h = src.get_height();
    if (gid.x >= w || gid.y >= h) return;
    float2 size = float2(w, h);
    float2 uv = (float2(gid) + 0.5) / size;
    float2 v = vel.sample(samp, uv).xy;
    float2 coord = (float2(gid) + 0.5) - dt * v;     // backtrace
    float4 result = src.sample(samp, coord / size) * dissipation;
    dst.write(result, gid);
}

kernel void divergence(texture2d<float, access::read>  vel [[texture(0)]],
                       texture2d<float, access::write>  div [[texture(1)]],
                       uint2 gid [[thread_position_in_grid]]) {
    int w = vel.get_width(), h = vel.get_height();
    if ((int)gid.x >= w || (int)gid.y >= h) return;
    int2 p = int2(gid);
    float l = vel.read(uint2(clampc(p + int2(-1,0), w, h))).x;
    float r = vel.read(uint2(clampc(p + int2( 1,0), w, h))).x;
    float b = vel.read(uint2(clampc(p + int2(0,-1), w, h))).y;
    float t = vel.read(uint2(clampc(p + int2(0, 1), w, h))).y;
    float d = 0.5 * ((r - l) + (t - b));
    div.write(float4(d, 0, 0, 0), gid);
}

// Jacobi step for ∇²p = div.
kernel void jacobi(texture2d<float, access::read>  x   [[texture(0)]],
                   texture2d<float, access::read>  bdiv[[texture(1)]],
                   texture2d<float, access::write>  out [[texture(2)]],
                   uint2 gid [[thread_position_in_grid]]) {
    int w = x.get_width(), h = x.get_height();
    if ((int)gid.x >= w || (int)gid.y >= h) return;
    int2 p = int2(gid);
    float l = x.read(uint2(clampc(p + int2(-1,0), w, h))).x;
    float r = x.read(uint2(clampc(p + int2( 1,0), w, h))).x;
    float b = x.read(uint2(clampc(p + int2(0,-1), w, h))).x;
    float t = x.read(uint2(clampc(p + int2(0, 1), w, h))).x;
    float div = bdiv.read(gid).x;
    out.write(float4((l + r + b + t - div) * 0.25, 0, 0, 0), gid);
}

kernel void subtractGradient(texture2d<float, access::read>  prs [[texture(0)]],
                             texture2d<float, access::read>  vin [[texture(1)]],
                             texture2d<float, access::write>  vout[[texture(2)]],
                             uint2 gid [[thread_position_in_grid]]) {
    int w = prs.get_width(), h = prs.get_height();
    if ((int)gid.x >= w || (int)gid.y >= h) return;
    int2 p = int2(gid);
    float l = prs.read(uint2(clampc(p + int2(-1,0), w, h))).x;
    float r = prs.read(uint2(clampc(p + int2( 1,0), w, h))).x;
    float b = prs.read(uint2(clampc(p + int2(0,-1), w, h))).x;
    float t = prs.read(uint2(clampc(p + int2(0, 1), w, h))).x;
    float2 v = vin.read(gid).xy - 0.5 * float2(r - l, t - b);
    vout.write(float4(v, 0, 0), gid);
}

struct SplatParams {
    float2 pos;      // grid coords
    float  radius;
    float  mode;     // 0 = uniform velocity, 1 = radial (bloom)
    float4 color;    // ink to add (rgb), density goes in .a
    float2 vel;      // velocity impulse (uniform mode)
    float  velMag;   // velocity magnitude (radial mode)
    float  pad;
};

kernel void splat(texture2d<float, access::read_write> dye [[texture(0)]],
                  texture2d<float, access::read_write> vel [[texture(1)]],
                  constant SplatParams& sp [[buffer(0)]],
                  uint2 gid [[thread_position_in_grid]]) {
    uint w = dye.get_width(), h = dye.get_height();
    if (gid.x >= w || gid.y >= h) return;
    float2 pt = float2(gid) + 0.5;
    float2 d = pt - sp.pos;
    float g = exp(-dot(d, d) / (sp.radius * sp.radius));
    if (g < 0.001) return;

    float4 dv = dye.read(gid);
    dv.rgb += sp.color.rgb * g;     // accumulate ink chroma
    dv.a   += sp.color.a   * g;     // accumulate density
    dye.write(dv, gid);

    float2 imp = sp.mode > 0.5
        ? normalize(d + 1e-4) * sp.velMag    // radial bloom
        : sp.vel;                            // directional push
    float2 vv = vel.read(gid).xy + imp * g;
    vel.write(float4(vv, 0, 0), gid);
}

// Composite ink over paper and write to the drawable.
kernel void display(texture2d<float, access::sample> dye [[texture(0)]],
                    texture2d<float, access::write>  out [[texture(1)]],
                    uint2 gid [[thread_position_in_grid]]) {
    uint w = out.get_width(), h = out.get_height();
    if (gid.x >= w || gid.y >= h) return;
    float2 uv = (float2(gid) + 0.5) / float2(w, h);
    float4 ink = dye.sample(samp, uv);
    float density = clamp(ink.a, 0.0, 1.0);
    float3 chroma = ink.a > 1e-3 ? ink.rgb / ink.a : float3(0.0);
    float3 paper  = float3(0.94, 0.91, 0.85);
    // ponytail: linear mix stands in for Kubelka-Munk absorption compositing.
    float3 col = mix(paper, chroma, density);
    out.write(float4(col, 1.0), gid);
}
"""

// MARK: - Renderer

struct SplatParams {
    var pos = SIMD2<Float>(0, 0)
    var radius: Float = 8
    var mode: Float = 0
    var color = SIMD4<Float>(0, 0, 0, 0)
    var vel = SIMD2<Float>(0, 0)
    var velMag: Float = 0
    var pad: Float = 0
}

final class Emitter {
    let ampX, ampY, freqX, freqY, phase: Float
    let color: SIMD4<Float>
    var prev = SIMD2<Float>(Float(GRID) / 2, Float(GRID) / 2)
    init(ampX: Float, ampY: Float, freqX: Float, freqY: Float, phase: Float, color: SIMD4<Float>) {
        self.ampX = ampX; self.ampY = ampY; self.freqX = freqX; self.freqY = freqY
        self.phase = phase; self.color = color
    }
    func position(_ t: Float) -> SIMD2<Float> {
        let c = Float(GRID) / 2
        return SIMD2<Float>(c + ampX * sin(freqX * t + phase),
                            c + ampY * cos(freqY * t + phase * 1.7))
    }
}

final class Renderer: NSObject, MTKViewDelegate {
    let device: MTLDevice
    let queue: MTLCommandQueue
    let pAdvect, pDivergence, pJacobi, pSubtract, pSplat, pDisplay: MTLComputePipelineState

    var vel: [MTLTexture]; var pressure: [MTLTexture]; var dye: [MTLTexture]
    let divergence: MTLTexture
    var vi = 0, pi = 0, di = 0   // ping-pong indices

    var frame = 0
    let emitters: [Emitter]
    let tg = MTLSize(width: 16, height: 16, depth: 1)
    let grid = MTLSize(width: GRID, height: GRID, depth: 1)

    init(device: MTLDevice) {
        self.device = device
        self.queue = device.makeCommandQueue()!
        let lib = try! device.makeLibrary(source: shaderSource, options: nil)
        func pipe(_ n: String) -> MTLComputePipelineState {
            try! device.makeComputePipelineState(function: lib.makeFunction(name: n)!)
        }
        pAdvect = pipe("advect"); pDivergence = pipe("divergence"); pJacobi = pipe("jacobi")
        pSubtract = pipe("subtractGradient"); pSplat = pipe("splat"); pDisplay = pipe("display")

        func tex(_ fmt: MTLPixelFormat) -> MTLTexture {
            let d = MTLTextureDescriptor.texture2DDescriptor(
                pixelFormat: fmt, width: GRID, height: GRID, mipmapped: false)
            d.usage = [.shaderRead, .shaderWrite]
            d.storageMode = .private
            return device.makeTexture(descriptor: d)!
        }
        vel = [tex(.rgba16Float), tex(.rgba16Float)]
        dye = [tex(.rgba16Float), tex(.rgba16Float)]
        pressure = [tex(.r32Float), tex(.r32Float)]
        divergence = tex(.r32Float)

        emitters = [
            Emitter(ampX: 110, ampY:  80, freqX: 0.011, freqY: 0.017, phase: 0.0,
                    color: SIMD4<Float>(0.05, 0.07, 0.16, 1.0)),   // sumi indigo
            Emitter(ampX:  90, ampY: 120, freqX: 0.019, freqY: 0.013, phase: 2.1,
                    color: SIMD4<Float>(0.45, 0.05, 0.10, 1.0)),   // crimson
            Emitter(ampX: 130, ampY: 100, freqX: 0.014, freqY: 0.021, phase: 4.2,
                    color: SIMD4<Float>(0.02, 0.20, 0.22, 1.0)),   // teal
        ]
        super.init()
    }

    func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {}

    private func dispatch(_ enc: MTLComputeCommandEncoder, _ p: MTLComputePipelineState,
                          tex: [(Int, MTLTexture)], bytes: [(Int, [UInt8])] = []) {
        enc.setComputePipelineState(p)
        for (i, t) in tex { enc.setTexture(t, index: i) }
        for (i, b) in bytes { b.withUnsafeBytes { enc.setBytes($0.baseAddress!, length: b.count, index: i) } }
        let groups = MTLSize(width: (GRID + 15) / 16, height: (GRID + 15) / 16, depth: 1)
        enc.dispatchThreadgroups(groups, threadsPerThreadgroup: tg)
    }

    private func floatBytes(_ f: Float) -> [UInt8] { withUnsafeBytes(of: f) { Array($0) } }
    private func splatBytes(_ s: SplatParams) -> [UInt8] { withUnsafeBytes(of: s) { Array($0) } }

    func draw(in view: MTKView) {
        guard let drawable = view.currentDrawable,
              let cb = queue.makeCommandBuffer() else { return }
        encode(target: drawable.texture, cb: cb)
        cb.present(drawable)
        cb.commit()
    }

    // The full per-frame pipeline, writing the composite into `target`.
    func encode(target: MTLTexture, cb: MTLCommandBuffer) {
        guard let enc = cb.makeComputeCommandEncoder() else { return }
        let t = Float(frame)

        // 1. advect velocity
        dispatch(enc, pAdvect, tex: [(0, vel[vi]), (1, vel[vi]), (2, vel[1 - vi])],
                 bytes: [(0, floatBytes(DT)), (1, floatBytes(0.992))])
        vi = 1 - vi

        // 2. add forces + ink from autonomous emitters (read_write in place)
        for e in emitters {
            let pos = e.position(t)
            let motion = pos - e.prev
            e.prev = pos
            // tangential swirl: push along motion + a perpendicular kick -> vortices
            let perp = SIMD2<Float>(-motion.y, motion.x)
            var sp = SplatParams()
            sp.pos = pos; sp.radius = Float(GRID) / 42
            sp.color = e.color * 0.12
            sp.vel = motion * 6.0 + perp * 3.0
            dispatch(enc, pSplat, tex: [(0, dye[di]), (1, vel[vi])], bytes: [(0, splatBytes(sp))])
        }
        // occasional radial bloom (an "ink drop")
        if frame % 220 == 90 {
            let k = frame / 220
            var sp = SplatParams()
            sp.pos = SIMD2<Float>(Float(GRID) * (0.3 + 0.4 * fract(0.618 * Float(k))),
                                  Float(GRID) * (0.3 + 0.4 * fract(0.414 * Float(k) + 0.5)))
            sp.radius = Float(GRID) / 16; sp.mode = 1
            sp.color = emitters[k % emitters.count].color * 0.25
            sp.velMag = 14.0
            dispatch(enc, pSplat, tex: [(0, dye[di]), (1, vel[vi])], bytes: [(0, splatBytes(sp))])
        }

        // 3. project: divergence -> Jacobi pressure -> subtract gradient
        dispatch(enc, pDivergence, tex: [(0, vel[vi]), (1, divergence)])
        for _ in 0..<PRESSURE_ITERS {
            dispatch(enc, pJacobi, tex: [(0, pressure[pi]), (1, divergence), (2, pressure[1 - pi])])
            pi = 1 - pi
        }
        dispatch(enc, pSubtract, tex: [(0, pressure[pi]), (1, vel[vi]), (2, vel[1 - vi])])
        vi = 1 - vi

        // 4. advect dye through the divergence-free velocity
        dispatch(enc, pAdvect, tex: [(0, dye[di]), (1, vel[vi]), (2, dye[1 - di])],
                 bytes: [(0, floatBytes(DT)), (1, floatBytes(0.9975))])
        di = 1 - di

        // 5. composite to target
        enc.setComputePipelineState(pDisplay)
        enc.setTexture(dye[di], index: 0)
        enc.setTexture(target, index: 1)
        let dw = target.width, dh = target.height
        enc.dispatchThreadgroups(
            MTLSize(width: (dw + 15) / 16, height: (dh + 15) / 16, depth: 1),
            threadsPerThreadgroup: tg)

        enc.endEncoding()
        frame += 1
    }

    // Headless: run `frames` steps offscreen, write the final composite to a PNG.
    func renderToPNG(frames: Int, path: String) {
        let d = MTLTextureDescriptor.texture2DDescriptor(
            pixelFormat: .rgba8Unorm, width: GRID, height: GRID, mipmapped: false)
        d.usage = [.shaderRead, .shaderWrite]
        d.storageMode = .shared
        let target = device.makeTexture(descriptor: d)!
        for _ in 0..<frames {
            let cb = queue.makeCommandBuffer()!
            encode(target: target, cb: cb)
            cb.commit(); cb.waitUntilCompleted()
        }
        var bytes = [UInt8](repeating: 0, count: GRID * GRID * 4)
        target.getBytes(&bytes, bytesPerRow: GRID * 4,
                        from: MTLRegionMake2D(0, 0, GRID, GRID), mipmapLevel: 0)
        let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: GRID, pixelsHigh: GRID,
            bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
            colorSpaceName: .deviceRGB, bytesPerRow: GRID * 4, bitsPerPixel: 32)!
        memcpy(rep.bitmapData!, bytes, bytes.count)
        try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path))
        FileHandle.standardError.write("wrote \(path) after \(frames) frames\n".data(using: .utf8)!)
    }
}

func fract(_ x: Float) -> Float { x - floor(x) }

// MARK: - App / window

final class InkView: MTKView {
    override var acceptsFirstResponder: Bool { true }
    override func keyDown(with e: NSEvent) {
        if e.keyCode == 53 || (e.charactersIgnoringModifiers == "q") { NSApp.terminate(nil) }  // Esc / q
    }
}

let device = MTLCreateSystemDefaultDevice()!

// Headless verification / artifact mode:  ./inkspike --headless [frames] [out.png]
if CommandLine.arguments.contains("--headless") {
    let args = CommandLine.arguments
    let frames = args.count > 2 ? (Int(args[2]) ?? 600) : 600
    let path = args.count > 3 ? args[3] : "ink-frame.png"
    Renderer(device: device).renderToPNG(frames: frames, path: path)
    exit(0)
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let view = InkView(frame: NSRect(x: 0, y: 0, width: 800, height: 800), device: device)
view.colorPixelFormat = .bgra8Unorm
view.framebufferOnly = false          // compute writes the drawable
view.preferredFramesPerSecond = 60
let renderer = Renderer(device: device)
view.delegate = renderer

let window = NSWindow(contentRect: view.frame,
                     styleMask: [.titled, .closable, .resizable],
                     backing: .buffered, defer: false)
window.title = "Ink-in-Water spike — Stable Fluids (Esc to quit)"
window.contentView = view
window.center()
window.makeKeyAndOrderFront(nil)
app.activate(ignoringOtherApps: true)
app.run()
