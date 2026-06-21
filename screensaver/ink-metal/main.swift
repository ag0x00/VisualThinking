// Sumi ink-on-paper — Lattice Boltzmann ink dispersion (MoXi: Chu & Tai 2005)
// on Metal compute shaders. Black Chinese ink percolating slowly through
// absorbent paper, dry and wet. Self-running (autonomous strokes), screensaver-shaped.
//
// Model (see wiki [[Lattice Boltzmann Method for Ink Dispersion]]):
//   D2Q9 LBE for water percolation, with MoXi's modifications —
//   * variable permeability via half-way partial bounce-back (paper grain → branching),
//   * advection modulation (psi) to keep the free wet/dry boundary stable,
//   * uneven evaporation (edge darkening),
//   * pigment advected by method-of-characteristics with hindrance (water leads, ink lags → feathery fringe),
//   * dry vs wet paper zones modulating permeability + receptivity.
// Three layers collapsed: deposit (surface) → LBE flow → ink stays when dry (fixture).
//
// ponytail: pigment fixture is implicit (ink doesn't evaporate); dynamic sigma-pinning
//   reduced to static heterogeneous permeability; Kubelka-Munk → flat mix(). Upgrades in README.
//
// The previous free-fluid spike is kept in inkwater.swift (Stable Fluids).

import Cocoa
import MetalKit
import simd

let GRID = 384
let DT: Float = 1.0

// MARK: - Shaders

let shaderSource = """
#include <metal_stdlib>
using namespace metal;

constexpr sampler samp(coord::normalized, address::clamp_to_edge, filter::linear);

constant int2 EV[9]  = { int2(0,0), int2(1,0), int2(0,1), int2(-1,0), int2(0,-1),
                         int2(1,1), int2(-1,1), int2(-1,-1), int2(1,-1) };
constant int  OPP[9] = { 0, 3, 4, 1, 2, 7, 8, 5, 6 };
constant float WT[9] = { 4.0/9.0, 1.0/9.0, 1.0/9.0, 1.0/9.0, 1.0/9.0,
                         1.0/36.0, 1.0/36.0, 1.0/36.0, 1.0/36.0 };

// ---- value-noise fbm (paper texture) ----
static float hash21(float2 p){ p = fract(p*float2(123.34,345.45)); p += dot(p,p+34.345); return fract(p.x*p.y); }
static float vnoise(float2 x){
    float2 i=floor(x), f=fract(x);
    float a=hash21(i), b=hash21(i+float2(1,0)), c=hash21(i+float2(0,1)), d=hash21(i+float2(1,1));
    float2 u=f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
static float fbm(float2 x){ float v=0,a=0.5; for(int i=0;i<5;i++){ v+=a*vnoise(x); x*=2.02; a*=0.5;} return v; }

// paper.r = openness (permeability), .g = wet/dry zone, .b = display grain
kernel void genPaper(texture2d<float, access::write> paper [[texture(0)]],
                     uint2 gid [[thread_position_in_grid]]) {
    uint w=paper.get_width(), h=paper.get_height();
    if(gid.x>=w||gid.y>=h) return;
    float2 uv = float2(gid)/float2(w,h);
    float open = 0.42 + 0.58*fbm(uv*15.0 + 3.0);
    open *= 0.70 + 0.55*vnoise(uv*float2(110.0,34.0));  // anisotropic fibre grain (higher contrast → feathering)
    open = clamp(open, 0.28, 1.0);
    float zone = smoothstep(0.46, 0.72, fbm(uv*2.1 + 7.0)); // big wet (1) vs dry (0) regions
    float grain = vnoise(uv*float2(210.0,70.0));
    paper.write(float4(open, zone, grain, 0.0), gid);
}

// f-distributions packed: fA=(f0..3) rgba, fB=(f4..7) rgba, fC=f8 r
static float readF(texture2d<float,access::read> A, texture2d<float,access::read> B,
                   texture2d<float,access::read> C, int i, int2 p, int2 dim){
    p = clamp(p, int2(0), dim-1);
    uint2 q = uint2(p);
    if(i<4) return A.read(q)[i];
    if(i<8) return B.read(q)[i-4];
    return C.read(q).r;
}

kernel void initWet(texture2d<float,access::read>  paper [[texture(0)]],
                    texture2d<float,access::write> fA [[texture(1)]],
                    texture2d<float,access::write> fB [[texture(2)]],
                    texture2d<float,access::write> fC [[texture(3)]],
                    texture2d<float,access::write> rho[[texture(4)]],
                    uint2 gid [[thread_position_in_grid]]) {
    uint w=paper.get_width(), h=paper.get_height();
    if(gid.x>=w||gid.y>=h) return;
    float zone = paper.read(gid).y;
    float r0 = zone * 0.55;                 // wet paper starts damp
    fA.write(float4(WT[0],WT[1],WT[2],WT[3])*r0, gid);
    fB.write(float4(WT[4],WT[5],WT[6],WT[7])*r0, gid);
    fC.write(float4(WT[8]*r0,0,0,0), gid);
    rho.write(float4(r0,0,0,0), gid);
}

struct DepositParams { float2 pos; float2 dir; float radius; float water; float ink;
                       float lambda; float mbase; float dryness; float seed; float pad; };

// adds water (to f) + ink (to p) under a brush footprint. An oriented elliptical
// nib + a direction-aligned bristle texture give calligraphic width and dry-brush
// flying-white (飛白) as the ink load runs out (dryness → 1).
kernel void deposit(texture2d<float,access::read_write> fA [[texture(0)]],
                    texture2d<float,access::read_write> fB [[texture(1)]],
                    texture2d<float,access::read_write> fC [[texture(2)]],
                    texture2d<float,access::read_write> p  [[texture(3)]],
                    texture2d<float,access::read>       rho[[texture(4)]],
                    texture2d<float,access::read>       paper[[texture(5)]],
                    constant DepositParams& dp [[buffer(0)]],
                    uint2 gid [[thread_position_in_grid]]) {
    uint w=fA.get_width(), h=fA.get_height();
    if(gid.x>=w||gid.y>=h) return;
    float2 pt = float2(gid)+0.5;
    float2 rel = pt - dp.pos;
    float2 t = dp.dir, n = float2(-dp.dir.y, dp.dir.x);
    float2 loc = float2(dot(rel,t), dot(rel,n));        // brush-local (along, across)
    // elongated nib along travel → continuous ribbon, less dotty
    float2 e = float2(loc.x/(dp.radius*1.8), loc.y/dp.radius);
    float g = exp(-dot(e,e));
    if(g<0.003) return;

    // bristle streaks: vary fast across the stroke, slow along it → lines parallel to travel
    float bristle = vnoise(float2(loc.x*0.05, loc.y*1.7) + dp.seed);
    float streak = smoothstep(dp.dryness, dp.dryness+0.30, bristle);    // gaps open as it dries
    float tooth  = smoothstep(dp.dryness*0.6, dp.dryness*0.6+0.5, paper.read(gid).z);
    float mask = mix(1.0, min(streak, tooth), smoothstep(0.12, 0.6, dp.dryness));

    float r = rho.read(gid).x;
    float recept = max(1.0 - r/dp.lambda, dp.mbase);
    float addInk = dp.ink * g * recept * mask;
    float addW   = dp.water * g * recept * mix(1.0, 0.45+0.55*mask, smoothstep(0.12,0.6,dp.dryness));

    float4 a=fA.read(gid), b=fB.read(gid); float c=fC.read(gid).x;
    a += float4(WT[0],WT[1],WT[2],WT[3])*addW;
    b += float4(WT[4],WT[5],WT[6],WT[7])*addW;
    c += WT[8]*addW;
    fA.write(a,gid); fB.write(b,gid); fC.write(float4(c,0,0,0),gid);
    p.write(float4(p.read(gid).x + addInk, 0,0,0), gid);
}

struct LbeParams { float omega; float alpha; float evap; float boundEvap; };

// fused stream(+permeability bounce-back) and collide; outputs rho and velocity
kernel void lbe(texture2d<float,access::read>  fAi [[texture(0)]],
                texture2d<float,access::read>  fBi [[texture(1)]],
                texture2d<float,access::read>  fCi [[texture(2)]],
                texture2d<float,access::read>  paper[[texture(3)]],
                texture2d<float,access::read>  rhoPrev[[texture(4)]],
                texture2d<float,access::write> fAo [[texture(5)]],
                texture2d<float,access::write> fBo [[texture(6)]],
                texture2d<float,access::write> fCo [[texture(7)]],
                texture2d<float,access::write> rhoOut[[texture(8)]],
                texture2d<float,access::write> uOut [[texture(9)]],
                constant LbeParams& lp [[buffer(0)]],
                uint2 gid [[thread_position_in_grid]]) {
    int w=fAi.get_width(), h=fAi.get_height();
    if((int)gid.x>=w||(int)gid.y>=h) return;
    int2 dim = int2(w,h);
    int2 x = int2(gid);
    float permX = paper.read(gid).x;

    float f[9];
    for(int i=0;i<9;i++){
        int2 src = x - EV[i];
        bool inb = src.x>=0 && src.y>=0 && src.x<w && src.y<h;
        float permS = inb ? paper.read(uint2(src)).x : 0.0;
        float o = inb ? clamp(0.5*(permX+permS), 0.0, 1.0) : 0.0;  // edge openness
        float streamed = readF(fAi,fBi,fCi, i, src, dim);
        float bounced  = readF(fAi,fBi,fCi, OPP[i], x, dim);       // half-way bounce-back
        f[i] = o*streamed + (1.0-o)*bounced;
    }
    // moments
    float rho = 0.0; for(int i=0;i<9;i++) rho += f[i];
    float2 u = float2(0.0);
    if(rho > 1e-4){ for(int i=0;i<9;i++) u += float2(EV[i])*f[i]; u /= rho; }
    float psi = smoothstep(0.0, lp.alpha, rho);   // advection modulation at free boundary
    float usq = dot(u,u);
    // collide (BGK)
    for(int i=0;i<9;i++){
        float eu = dot(float2(EV[i]), u);
        float feq = WT[i]*(rho + rho*psi*(3.0*eu + 4.5*eu*eu - 1.5*usq));
        f[i] = (1.0-lp.omega)*f[i] + lp.omega*feq;
    }
    // uneven evaporation -> edge darkening: extra loss where wet next to dry
    float bnd = 0.0;
    if(rho > 0.05){
        for(int i=1;i<5;i++){
            int2 n = clamp(x+EV[i], int2(0), dim-1);
            if(rhoPrev.read(uint2(n)).x < 0.05) bnd += 0.25;
        }
    }
    float factor = 1.0 - (lp.evap + lp.boundEvap*bnd);
    factor = max(factor, 0.0);
    for(int i=0;i<9;i++) f[i] *= factor;
    rho *= factor;

    fAo.write(float4(f[0],f[1],f[2],f[3]), gid);
    fBo.write(float4(f[4],f[5],f[6],f[7]), gid);
    fCo.write(float4(f[8],0,0,0), gid);
    rhoOut.write(float4(rho,0,0,0), gid);
    uOut.write(float4(u,0,0), gid);
}

struct PigParams { float dt; float gammaMove; float velThr; float decay; float wetThr; };

// pigment advection by method of characteristics, with flow-speed hindrance
kernel void pigment(texture2d<float,access::sample> pIn [[texture(0)]],
                    texture2d<float,access::read>   uIn [[texture(1)]],
                    texture2d<float,access::read>   rho [[texture(2)]],
                    texture2d<float,access::write>  pOut[[texture(3)]],
                    constant PigParams& pp [[buffer(0)]],
                    uint2 gid [[thread_position_in_grid]]) {
    uint w=pIn.get_width(), h=pIn.get_height();
    if(gid.x>=w||gid.y>=h) return;
    float2 size=float2(w,h);
    float2 u = uIn.read(gid).xy;
    float2 coord = (float2(gid)+0.5) - pp.dt*u;
    float pStar = pIn.sample(samp, coord/size).x;     // advected-in pigment
    float pHere = pIn.sample(samp, (float2(gid)+0.5)/size).x;
    float speed = length(u);
    // gamma -> 1 (stay/pinned) when slow, -> gammaMove when fast
    float gamma = mix(1.0, pp.gammaMove, smoothstep(0.0, pp.velThr, speed));
    float pNew = mix(pStar, pHere, gamma);
    pNew *= pp.decay;                                  // slow screensaver fade
    pOut.write(float4(pNew,0,0,0), gid);
}

kernel void display(texture2d<float,access::sample> p   [[texture(0)]],
                    texture2d<float,access::read>   rho [[texture(1)]],
                    texture2d<float,access::read>   paper[[texture(2)]],
                    texture2d<float,access::write>  out [[texture(3)]],
                    constant float& inkGain [[buffer(0)]],
                    uint2 gid [[thread_position_in_grid]]) {
    uint w=out.get_width(), h=out.get_height();
    if(gid.x>=w||gid.y>=h) return;
    float2 uv = (float2(gid)+0.5)/float2(w,h);
    float ink = clamp(p.sample(samp, uv).x * inkGain, 0.0, 1.0);
    uint2 pg = uint2(uv*float2(paper.get_width(), paper.get_height()));
    float grain = paper.read(pg).z;
    float r = rho.read(pg).x;
    float3 paperCol = float3(0.93,0.90,0.84) * (0.96 + 0.04*grain);  // warm paper + tooth
    paperCol *= 1.0 - 0.035*smoothstep(0.10,0.55,r);                 // damp paper reads slightly cooler/darker
    float3 inkCol = float3(0.06,0.06,0.075);                         // sumi black (slightly cool)
    // ponytail: linear mix stands in for Kubelka-Munk absorption.
    float3 col = mix(paperCol, inkCol, ink);
    out.write(float4(col,1.0), gid);
}
"""

// MARK: - Renderer

struct DepositParams { var pos=SIMD2<Float>(0,0); var dir=SIMD2<Float>(1,0); var radius:Float=8; var water:Float=0.1; var ink:Float=0.06; var lambda:Float=1.0; var mbase:Float=0.12; var dryness:Float=0; var seed:Float=0; var pad:Float=0 }
struct LbeParams { var omega:Float=0.55; var alpha:Float=0.4; var evap:Float=0.0009; var boundEvap:Float=0.0028 }
struct PigParams { var dt:Float=1.0; var gammaMove:Float=0.35; var velThr:Float=0.02; var decay:Float=0.99965; var wetThr:Float=0.03 }

// A calligraphic sumi stroke: a cubic Bézier centerline drawn over `life` frames with a
// pressure profile (tapered ends, fuller belly) and ink-load depletion (wet→dry, flying white).
struct Stroke {
    var p0=SIMD2<Float>(0,0), p1=SIMD2<Float>(0,0), p2=SIMD2<Float>(0,0), p3=SIMD2<Float>(0,0)
    var start=0, life=60
    var baseR:Float=6, ink:Float=0.09, water:Float=0.13, seed:Float=0
    var wash=false
}
func bezier(_ s:Stroke,_ t:Float)->SIMD2<Float> {
    let u=1-t; return u*u*u*s.p0 + 3*u*u*t*s.p1 + 3*u*t*t*s.p2 + t*t*t*s.p3
}
func bezierTangent(_ s:Stroke,_ t:Float)->SIMD2<Float> {
    let u=1-t; return 3*u*u*(s.p1-s.p0) + 6*u*t*(s.p2-s.p1) + 3*t*t*(s.p3-s.p2)
}
// pressure: soft entry taper, long dark body, taper to a point — a calligraphic ribbon
func pressure(_ t:Float)->Float { smoothstep(0,0.16,t) * (1 - smoothstep(0.55,1.0,t)) }
func smoothstep(_ a:Float,_ b:Float,_ x:Float)->Float { let t=max(0,min(1,(x-a)/(b-a))); return t*t*(3-2*t) }

final class Renderer: NSObject, MTKViewDelegate {
    let device: MTLDevice
    let queue: MTLCommandQueue
    let pGen, pInit, pDeposit, pLbe, pPigment, pDisplay: MTLComputePipelineState

    var fA=[MTLTexture](), fB=[MTLTexture](), fC=[MTLTexture]()
    var rho=[MTLTexture](), p=[MTLTexture]()
    var uTex: MTLTexture!, paper: MTLTexture!
    var ff=0, rr=0, pp=0

    var frame = 0
    var rng: UInt64 = 0x9e3779b97f4a7c15
    var strokes: [Stroke] = []
    let tg = MTLSize(width:16, height:16, depth:1)
    let groups = MTLSize(width:(GRID+15)/16, height:(GRID+15)/16, depth:1)

    init(device: MTLDevice) {
        self.device = device
        queue = device.makeCommandQueue()!
        let lib = try! device.makeLibrary(source: shaderSource, options: nil)
        func pipe(_ n:String)->MTLComputePipelineState { try! device.makeComputePipelineState(function: lib.makeFunction(name:n)!) }
        pGen=pipe("genPaper"); pInit=pipe("initWet"); pDeposit=pipe("deposit")
        pLbe=pipe("lbe"); pPigment=pipe("pigment"); pDisplay=pipe("display")

        func tex(_ fmt:MTLPixelFormat)->MTLTexture {
            let d=MTLTextureDescriptor.texture2DDescriptor(pixelFormat:fmt,width:GRID,height:GRID,mipmapped:false)
            d.usage=[.shaderRead,.shaderWrite]; d.storageMode = .private
            return device.makeTexture(descriptor:d)!
        }
        fA=[tex(.rgba16Float),tex(.rgba16Float)]; fB=[tex(.rgba16Float),tex(.rgba16Float)]
        fC=[tex(.r16Float),tex(.r16Float)]; rho=[tex(.r16Float),tex(.r16Float)]
        p=[tex(.r16Float),tex(.r16Float)]; uTex=tex(.rg16Float); paper=tex(.rgba16Float)
        super.init()
        seed()
    }

    private func nextRand()->Float { rng ^= rng<<13; rng ^= rng>>7; rng ^= rng<<17; return Float(rng % 10000)/10000.0 }

    private func seed() {
        let cb=queue.makeCommandBuffer()!, enc=cb.makeComputeCommandEncoder()!
        enc.setComputePipelineState(pGen); enc.setTexture(paper,index:0)
        enc.dispatchThreadgroups(groups,threadsPerThreadgroup:tg)
        enc.setComputePipelineState(pInit)
        enc.setTexture(paper,index:0); enc.setTexture(fA[0],index:1); enc.setTexture(fB[0],index:2)
        enc.setTexture(fC[0],index:3); enc.setTexture(rho[0],index:4)
        enc.dispatchThreadgroups(groups,threadsPerThreadgroup:tg)
        enc.endEncoding(); cb.commit()
    }

    func mtkView(_ v: MTKView, drawableSizeWillChange s: CGSize) {}

    private func bytes<T>(_ v:T)->[UInt8] { withUnsafeBytes(of:v){Array($0)} }
    private func dispatch(_ e:MTLComputeCommandEncoder){ e.dispatchThreadgroups(groups,threadsPerThreadgroup:tg) }

    // one brush footprint (pipeline state already set by caller)
    private func stampDeposit(_ enc: MTLComputeCommandEncoder, _ dp: DepositParams) {
        enc.setTexture(fA[ff],index:0); enc.setTexture(fB[ff],index:1); enc.setTexture(fC[ff],index:2)
        enc.setTexture(p[pp],index:3); enc.setTexture(rho[rr],index:4); enc.setTexture(paper,index:5)
        let b=bytes(dp); b.withUnsafeBytes{ enc.setBytes($0.baseAddress!,length:b.count,index:0) }
        dispatch(enc)
    }

    private func spawnStrokes() {
        let G = Float(GRID)
        // a new calligraphic stroke every ~165 frames
        if frame % 165 == 0 {
            let start = SIMD2<Float>(G*(0.14+0.55*nextRand()), G*(0.14+0.55*nextRand()))
            let ang = nextRand()*6.2832
            let len = G*(0.30+0.45*nextRand())
            let dir = SIMD2<Float>(cos(ang), sin(ang))
            let perp = SIMD2<Float>(-dir.y, dir.x)
            let c1 = (nextRand()-0.5)*0.55*len, c2 = (nextRand()-0.5)*0.55*len   // gentle flowing curve
            var s = Stroke()
            s.p0 = start
            s.p1 = start + dir*(len*0.33) + perp*c1
            s.p2 = start + dir*(len*0.66) + perp*c2
            s.p3 = start + dir*len + perp*((nextRand()-0.5)*0.2*len)
            s.start = frame
            s.life = Int(len/G * 135) + 30          // longer stroke = drawn slower
            s.baseR = G/60 * (0.75 + 0.5*nextRand())
            s.ink = 0.10; s.water = 0.14
            s.seed = nextRand()*60
            strokes.append(s)
        }
        if frame % 600 == 280 {   // wet-paper wash (water only, big soft area)
            var s = Stroke()
            let c = SIMD2<Float>(G*(0.25+0.5*nextRand()), G*(0.25+0.5*nextRand()))
            s.p0 = c; s.p1 = c; s.p2 = c; s.p3 = c
            s.start = frame; s.life = 26; s.baseR = G/6; s.wash = true
            strokes.append(s)
        }
        strokes.removeAll { frame - $0.start > $0.life + 2 }
    }

    func encode(target: MTLTexture, cb: MTLCommandBuffer) {
        guard let enc = cb.makeComputeCommandEncoder() else { return }
        spawnStrokes()

        // 1. deposit active strokes — substamp along the Bézier this frame for a continuous ribbon
        enc.setComputePipelineState(pDeposit)
        for s in strokes {
            let age = frame - s.start
            if age < 0 || age > s.life { continue }
            if s.wash {
                var dp = DepositParams()
                dp.pos = s.p0; dp.radius = s.baseR; dp.water = 0.16; dp.ink = 0
                stampDeposit(enc, dp); continue
            }
            let t0 = max(0, Float(age-1)/Float(s.life))
            let t1 = Float(age)/Float(s.life)
            let SUB = 8
            for k in 1...SUB {
                let t = t0 + (t1 - t0) * Float(k)/Float(SUB)
                let tan = bezierTangent(s, t)
                let dir = simd_length(tan) > 1e-4 ? simd_normalize(tan) : SIMD2<Float>(1,0)
                let load: Float = exp(-1.9 * t)               // ink depletes along the stroke
                var dp = DepositParams()
                dp.pos = bezier(s, t)
                dp.dir = dir
                dp.radius = max(s.baseR * pressure(t), 0.6)   // tapered ends, fuller belly
                dp.ink = s.ink * load
                dp.water = s.water * (0.4 + 0.6*load)
                dp.dryness = 1 - min(load*1.15, 1)            // wet head → dry, flying-white tail
                dp.seed = s.seed
                stampDeposit(enc, dp)
            }
        }

        // 2. LBE step (stream+collide), f[ff]->f[1-ff], rho[rr]->rho[1-rr], u
        var lp = LbeParams()
        enc.setComputePipelineState(pLbe)
        enc.setTexture(fA[ff],index:0); enc.setTexture(fB[ff],index:1); enc.setTexture(fC[ff],index:2)
        enc.setTexture(paper,index:3); enc.setTexture(rho[rr],index:4)
        enc.setTexture(fA[1-ff],index:5); enc.setTexture(fB[1-ff],index:6); enc.setTexture(fC[1-ff],index:7)
        enc.setTexture(rho[1-rr],index:8); enc.setTexture(uTex,index:9)
        let lb=bytes(lp); lb.withUnsafeBytes{ enc.setBytes($0.baseAddress!,length:lb.count,index:0) }
        dispatch(enc)
        ff = 1-ff; rr = 1-rr

        // 3. pigment advection p[pp]->p[1-pp]
        var pgp = PigParams()
        enc.setComputePipelineState(pPigment)
        enc.setTexture(p[pp],index:0); enc.setTexture(uTex,index:1); enc.setTexture(rho[rr],index:2)
        enc.setTexture(p[1-pp],index:3)
        let pb=bytes(pgp); pb.withUnsafeBytes{ enc.setBytes($0.baseAddress!,length:pb.count,index:0) }
        dispatch(enc)
        pp = 1-pp

        // 4. display
        var gain: Float = 3.2
        enc.setComputePipelineState(pDisplay)
        enc.setTexture(p[pp],index:0); enc.setTexture(rho[rr],index:1); enc.setTexture(paper,index:2)
        enc.setTexture(target,index:3)
        let gb=bytes(gain); gb.withUnsafeBytes{ enc.setBytes($0.baseAddress!,length:gb.count,index:0) }
        let dw=target.width, dh=target.height
        enc.dispatchThreadgroups(MTLSize(width:(dw+15)/16,height:(dh+15)/16,depth:1),threadsPerThreadgroup:tg)

        enc.endEncoding()
        frame += 1
        _ = lp; _ = pgp; _ = gain
    }

    func draw(in view: MTKView) {
        guard let drawable=view.currentDrawable, let cb=queue.makeCommandBuffer() else { return }
        encode(target: drawable.texture, cb: cb)
        cb.present(drawable); cb.commit()
    }

    func renderToPNG(frames: Int, path: String) {
        let d=MTLTextureDescriptor.texture2DDescriptor(pixelFormat:.rgba8Unorm,width:GRID,height:GRID,mipmapped:false)
        d.usage=[.shaderRead,.shaderWrite]; d.storageMode = .shared
        let target=device.makeTexture(descriptor:d)!
        for _ in 0..<frames { let cb=queue.makeCommandBuffer()!; encode(target:target,cb:cb); cb.commit(); cb.waitUntilCompleted() }
        var buf=[UInt8](repeating:0,count:GRID*GRID*4)
        target.getBytes(&buf,bytesPerRow:GRID*4,from:MTLRegionMake2D(0,0,GRID,GRID),mipmapLevel:0)
        let rep=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:GRID,pixelsHigh:GRID,bitsPerSample:8,
            samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:GRID*4,bitsPerPixel:32)!
        memcpy(rep.bitmapData!,buf,buf.count)
        try! rep.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:path))
        FileHandle.standardError.write("wrote \(path) after \(frames) frames\n".data(using:.utf8)!)
    }
}

// MARK: - App

let device = MTLCreateSystemDefaultDevice()!
if CommandLine.arguments.contains("--headless") {
    let a=CommandLine.arguments
    let frames = a.count>2 ? (Int(a[2]) ?? 600) : 600
    let path = a.count>3 ? a[3] : "ink-paper.png"
    Renderer(device:device).renderToPNG(frames:frames, path:path)
    exit(0)
}

final class InkView: MTKView {
    override var acceptsFirstResponder: Bool { true }
    override func keyDown(with e: NSEvent) { if e.keyCode==53 || e.charactersIgnoringModifiers=="q" { NSApp.terminate(nil) } }
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let view = InkView(frame: NSRect(x:0,y:0,width:800,height:800), device: device)
view.colorPixelFormat = .bgra8Unorm
view.framebufferOnly = false
view.preferredFramesPerSecond = 60
let renderer = Renderer(device: device)
view.delegate = renderer
let window = NSWindow(contentRect: view.frame, styleMask:[.titled,.closable,.resizable], backing:.buffered, defer:false)
window.title = "Sumi ink-on-paper — Lattice Boltzmann (Esc to quit)"
window.contentView = view
window.center(); window.makeKeyAndOrderFront(nil)
app.activate(ignoringOtherApps: true)
app.run()
