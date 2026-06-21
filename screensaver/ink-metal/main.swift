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

// Brush register — 工筆 gongbi (controlled, even, clean spine, minimal bleed) is the default;
// 寫意 xieyi (spontaneous, splashed, strong flying-white) via `--xieyi`.
struct Register {
    var sideProb: Float    // chance of a side-tip (侧锋) stroke
    var water: Float       // base water deposited → bleed amount
    var ink: Float         // base ink deposited
    var depletion: Float   // ink fade along the stroke (low = even gongbi line)
    var fw: Float          // flying-white intensity (0 = none)
    var rCentre: Float     // baseR divisor (larger = thinner) for centre-tip
    var rSide: Float
    var curve: Float       // centerline bend
    var permContrast: Float // paper-grain contrast → percolation edge roughening (low = smooth spine)
}
let GONGBI = Register(sideProb:0.16, water:0.014, ink:0.32, depletion:0.7, fw:0.22, rCentre:128, rSide:94, curve:0.32, permContrast:0.40)
let XIEYI  = Register(sideProb:0.45, water:0.085, ink:0.27, depletion:1.9, fw:1.0,  rCentre:104, rSide:78, curve:0.50, permContrast:1.0)
let REG = CommandLine.arguments.contains("--xieyi") ? XIEYI : GONGBI

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
// contrast scales grain heterogeneity → percolation edge roughening (low = smooth gongbi spine)
kernel void genPaper(texture2d<float, access::write> paper [[texture(0)]],
                     constant float& contrast [[buffer(0)]],
                     constant float& sd [[buffer(1)]],
                     uint2 gid [[thread_position_in_grid]]) {
    uint w=paper.get_width(), h=paper.get_height();
    if(gid.x>=w||gid.y>=h) return;
    float2 uv = float2(gid)/float2(w,h);
    float2 o = float2(sd, sd*1.7);                      // per-painting paper variation
    float open = 0.42 + 0.58*fbm(uv*15.0 + 3.0 + o);
    open *= 0.70 + 0.55*vnoise(uv*float2(110.0,34.0) + o);  // anisotropic fibre grain
    open = mix(0.80, open, contrast);                   // flatten toward uniform when contrast low
    open = clamp(open, 0.28, 1.0);
    float zone = smoothstep(0.46, 0.72, fbm(uv*2.1 + 7.0 + o)); // big wet (1) vs dry (0) regions
    float grain = vnoise(uv*float2(210.0,70.0) + o);
    paper.write(float4(open, zone, grain, 0.0), gid);
}

// zero a single-channel field (for resetting ink between paintings)
kernel void clearR(texture2d<float,access::write> t [[texture(0)]], uint2 gid [[thread_position_in_grid]]) {
    if(gid.x>=t.get_width()||gid.y>=t.get_height()) return;
    t.write(float4(0), gid);
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
                       float lambda; float mbase; float dryness; float seed; float nibAspect;
                       float fwIntensity; float channel; };   // channel: 0 = black ink, 1 = red

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
    // elongated nib along travel; aspect sets centre-tip (round, even) vs side-tip (flat, broad)
    float2 e = float2(loc.x/(dp.radius*dp.nibAspect), loc.y/dp.radius);
    float g = exp(-dot(e,e)*3.0);     // tight falloff → crisp thin stroke (not a wide soft halo)
    if(g<0.012) return;

    // Flying-white (飛白): organic, BROKEN streaks — not regular combs ("tire tracks").
    // Two irregular octaves across the stroke + breakup ALONG its length, only at the dry tail,
    // and only partial (wispy) removal. Scaled by register (gongbi ≈ none, xieyi ≈ full).
    float fw = dp.fwIntensity * smoothstep(0.42, 0.86, dp.dryness);
    float mask = 1.0;
    if (fw > 0.001) {
        float b1 = vnoise(float2(loc.x*0.045, loc.y*1.20) + dp.seed);
        float b2 = vnoise(float2(loc.x*0.130, loc.y*3.10) + dp.seed*1.9);
        float bristle = b1*0.6 + b2*0.4;
        float along = 0.40 + 0.60*vnoise(float2(loc.x*0.20 + dp.seed*4.0, dp.seed)); // break along length
        float gaps = smoothstep(0.42, 0.72, bristle);          // 1 = hair present, 0 = gap
        float streak = 1.0 - (1.0 - gaps) * along;             // partial, broken (not hard gaps)
        mask = mix(1.0, streak, fw);
    }

    float r = rho.read(gid).x;
    float recept = max(1.0 - r/dp.lambda, dp.mbase);
    float addInk = dp.ink * g * recept * mask;
    float addW   = dp.water * g * recept * mix(1.0, 0.55+0.45*mask, fw);

    float4 a=fA.read(gid), b=fB.read(gid); float c=fC.read(gid).x;
    a += float4(WT[0],WT[1],WT[2],WT[3])*addW;
    b += float4(WT[4],WT[5],WT[6],WT[7])*addW;
    c += WT[8]*addW;
    fA.write(a,gid); fB.write(b,gid); fC.write(float4(c,0,0,0),gid);
    float2 pv = p.read(gid).xy;                 // .x = black pigment, .y = red
    if (dp.channel < 0.5) pv.x += addInk; else pv.y += addInk;
    p.write(float4(pv, 0, 0), gid);
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
    float2 pStar = pIn.sample(samp, coord/size).xy;   // advected-in pigment (black, red)
    float2 pHere = pIn.sample(samp, (float2(gid)+0.5)/size).xy;
    float speed = length(u);
    // gamma -> 1 (stay/pinned) when slow, -> gammaMove when fast
    float gamma = mix(1.0, pp.gammaMove, smoothstep(0.0, pp.velThr, speed));
    float2 pNew = mix(pStar, pHere, gamma) * pp.decay; // slow fade / fast during the fade phase
    pOut.write(float4(pNew,0,0), gid);
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
    float2 pig = p.sample(samp, uv).xy * inkGain;
    float blackD = clamp(pig.x, 0.0, 1.0);
    float redD   = clamp(pig.y, 0.0, 1.0);
    uint2 pg = uint2(uv*float2(paper.get_width(), paper.get_height()));
    float grain = paper.read(pg).z;
    float r = rho.read(pg).x;
    float3 paperCol = float3(0.93,0.90,0.84) * (0.96 + 0.04*grain);  // warm paper + tooth
    paperCol *= 1.0 - 0.035*smoothstep(0.10,0.55,r);                 // damp paper reads slightly cooler/darker
    float3 inkCol = float3(0.06,0.06,0.075);                         // sumi black (slightly cool)
    // ponytail: linear mix stands in for Kubelka-Munk absorption.
    float3 col = mix(paperCol, inkCol, blackD);
    float3 vermilion = float3(0.70, 0.11, 0.09);                     // 朱 cinnabar red, sits on top
    col = mix(col, vermilion, redD);
    out.write(float4(col,1.0), gid);
}
"""

// MARK: - Renderer

struct DepositParams { var pos=SIMD2<Float>(0,0); var dir=SIMD2<Float>(1,0); var radius:Float=8; var water:Float=0.1; var ink:Float=0.06; var lambda:Float=1.0; var mbase:Float=0.12; var dryness:Float=0; var seed:Float=0; var nibAspect:Float=1.8; var fwIntensity:Float=1; var channel:Float=0 }
struct LbeParams { var omega:Float=0.55; var alpha:Float=0.4; var evap:Float=0.0024; var boundEvap:Float=0.0030 }
struct PigParams { var dt:Float=1.0; var gammaMove:Float=0.35; var velThr:Float=0.02; var decay:Float=0.99965; var wetThr:Float=0.03 }

// A calligraphic sumi stroke: a cubic Bézier centerline drawn over `life` frames. Carries
// brush dynamics — three-phase pressure (起笔/行笔/收笔), centre/side-tip nib, ink tone
// (墨分五色), and a per-stroke seed driving organic micro-variation.
struct Stroke {
    var p0=SIMD2<Float>(0,0), p1=SIMD2<Float>(0,0), p2=SIMD2<Float>(0,0), p3=SIMD2<Float>(0,0)
    var start=0, life=60
    var baseR:Float=6, ink:Float=0.09, water:Float=0.13, seed:Float=0
    var inkConc:Float=1          // 墨分五色 tone (burnt..clear)
    var nibAspect:Float=1.8      // 中锋 (round, ~1.4) vs 侧锋 (broad, ~2.8)
    var drynessBias:Float=0      // side-tip strokes start drier → earlier flying-white
    var exitStyle:Int=0          // 收笔: 0 = taper to point, 1 = pressed hook
    var depletion:Float=1.9      // ink fade rate along the stroke (low = even gongbi line)
    var fwIntensity:Float=1      // flying-white intensity (register-set)
    var channel:Int=0            // 0 = black ink, 1 = red accent
    var even=false               // even thin line (red sweep) vs calligraphic belly
    var dir=SIMD2<Float>(1,0), len:Float=0   // overall gesture (for directed-tension accumulator)
    var wash=false
}
func bezier(_ s:Stroke,_ t:Float)->SIMD2<Float> {
    let u=1-t; return u*u*u*s.p0 + 3*u*u*t*s.p1 + 3*u*t*t*s.p2 + t*t*t*s.p3
}
func bezierTangent(_ s:Stroke,_ t:Float)->SIMD2<Float> {
    let u=1-t; return 3*u*u*(s.p1-s.p0) + 6*u*t*(s.p2-s.p1) + 3*t*t*(s.p3-s.p2)
}
func smoothstep(_ a:Float,_ b:Float,_ x:Float)->Float { let t=max(0,min(1,(x-a)/(b-a))); return t*t*(3-2*t) }
func gauss(_ t:Float,_ mu:Float,_ sig:Float)->Float { let z=(t-mu)/sig; return exp(-z*z) }
func mix(_ a:Float,_ b:Float,_ t:Float)->Float { a + (b-a)*t }
// minimum-jerk easing: hand-like accelerate-then-decelerate (organic, not constant-speed)
func minJerk(_ x:Float)->Float { let t=max(0,min(1,x)); return t*t*t*(10 - 15*t + 6*t*t) }

// Three-phase calligraphic pressure: 起笔 entry accent (hidden-tip press) → 行笔 modulated body →
// 收笔 exit (taper to a point, or a pressed hook). seed drives organic body wobble.
func pressure(_ t:Float,_ exitStyle:Int,_ seed:Float)->Float {
    let entry = smoothstep(0, 0.09, t)                     // establish width fast
    let taper = 1 - smoothstep(0.74, 1.0, t)               // long even body, taper only near the tip → leaner line
    let accent = 0.18 * gauss(t, 0.06, 0.05)               // 藏锋 press at the start (subtle, not bulbous)
    let wobble = 1 + 0.08*(sin(t*9+seed)*0.6 + sin(t*17+seed*1.7)*0.4)   // organic body variation
    var p = (entry*taper + accent*entry) * wobble
    if exitStyle == 1 { p += 0.5 * gauss(t, 0.85, 0.05) * taper }        // 收笔 hook
    return max(p, 0)
}

final class Renderer: NSObject, MTKViewDelegate {
    let device: MTLDevice
    let queue: MTLCommandQueue
    let pGen, pInit, pDeposit, pLbe, pPigment, pDisplay, pClear: MTLComputePipelineState

    var fA=[MTLTexture](), fB=[MTLTexture](), fC=[MTLTexture]()
    var rho=[MTLTexture](), p=[MTLTexture]()
    var uTex: MTLTexture!, paper: MTLTexture!
    var ff=0, rr=0, pp=0

    var frame = 0
    var rng: UInt64 = 0x9e3779b97f4a7c15
    var strokes: [Stroke] = []
    let tg = MTLSize(width:16, height:16, depth:1)
    let groups = MTLSize(width:(GRID+15)/16, height:(GRID+15)/16, depth:1)

    // composition state (Ma-aware placement) + temporal-ma scheduler + directed-tension accumulator
    let OC = 32                               // coarse occupancy grid
    var occ = [Float](repeating:0, count:32*32)
    var nextSpawn = 0, burstLeft = 0
    var tensionAcc = SIMD2<Float>(0,0)        // decaying sum of stroke gesture vectors

    // painting lifecycle: paint black → wait (settle) → dry+red → hold → fade → new painting
    enum Phase { case painting, waiting, redding, holding, fading }
    var phase: Phase = .painting
    var phaseStart = 0
    var strokesDone = 0, strokeTarget = 7
    var dry = false                           // paper dried: pigment frozen (black stops growing)
    var inkDecay: Float = 0.9999              // driven by phase; fast during fade
    var paperSeed: Float = 0
    let WAIT = 120, HOLD = 300, FADE = 130    // frames (~60fps): wait ~2s, hold ~5s, fade ~2.2s

    init(device: MTLDevice) {
        self.device = device
        queue = device.makeCommandQueue()!
        let lib = try! device.makeLibrary(source: shaderSource, options: nil)
        func pipe(_ n:String)->MTLComputePipelineState { try! device.makeComputePipelineState(function: lib.makeFunction(name:n)!) }
        pGen=pipe("genPaper"); pInit=pipe("initWet"); pDeposit=pipe("deposit")
        pLbe=pipe("lbe"); pPigment=pipe("pigment"); pDisplay=pipe("display"); pClear=pipe("clearR")

        func tex(_ fmt:MTLPixelFormat)->MTLTexture {
            let d=MTLTextureDescriptor.texture2DDescriptor(pixelFormat:fmt,width:GRID,height:GRID,mipmapped:false)
            d.usage=[.shaderRead,.shaderWrite]; d.storageMode = .private
            return device.makeTexture(descriptor:d)!
        }
        fA=[tex(.rgba16Float),tex(.rgba16Float)]; fB=[tex(.rgba16Float),tex(.rgba16Float)]
        fC=[tex(.r16Float),tex(.r16Float)]; rho=[tex(.r16Float),tex(.r16Float)]
        p=[tex(.rg16Float),tex(.rg16Float)]; uTex=tex(.rg16Float); paper=tex(.rgba16Float)  // p: x=black, y=red
        super.init()
        seed()
    }

    private func nextRand()->Float { rng ^= rng<<13; rng ^= rng>>7; rng ^= rng<<17; return Float(rng % 10000)/10000.0 }

    private func seed() {
        ff=0; rr=0; pp=0
        let cb=queue.makeCommandBuffer()!, enc=cb.makeComputeCommandEncoder()!
        enc.setComputePipelineState(pGen); enc.setTexture(paper,index:0)
        var contrast = REG.permContrast, sd = paperSeed
        withUnsafeBytes(of:&contrast){ enc.setBytes($0.baseAddress!,length:4,index:0) }
        withUnsafeBytes(of:&sd){ enc.setBytes($0.baseAddress!,length:4,index:1) }
        enc.dispatchThreadgroups(groups,threadsPerThreadgroup:tg)
        enc.setComputePipelineState(pInit)
        enc.setTexture(paper,index:0); enc.setTexture(fA[0],index:1); enc.setTexture(fB[0],index:2)
        enc.setTexture(fC[0],index:3); enc.setTexture(rho[0],index:4)
        enc.dispatchThreadgroups(groups,threadsPerThreadgroup:tg)
        // start each painting from clean paper: zero both ink fields
        enc.setComputePipelineState(pClear)
        for t in [p[0], p[1]] { enc.setTexture(t,index:0); enc.dispatchThreadgroups(groups,threadsPerThreadgroup:tg) }
        enc.endEncoding(); cb.commit()
    }

    // begin a fresh painting: new paper, cleared ink, reset composition state
    private func resetPainting() {
        paperSeed += 13.7
        seed()
        for i in occ.indices { occ[i]=0 }
        tensionAcc = SIMD2<Float>(0,0)
        strokes.removeAll(); strokesDone = 0; dry = false
        strokeTarget = 4 + Int(nextRand()*4)     // 4–7 strokes per painting
        nextSpawn = frame + 20; burstLeft = 0
        phase = .painting; phaseStart = frame
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

    private func occIdx(_ pos:SIMD2<Float>)->Int {
        let g=Float(GRID)
        let cx=max(0,min(OC-1,Int(pos.x/g*Float(OC)))), cy=max(0,min(OC-1,Int(pos.y/g*Float(OC))))
        return cy*OC+cx
    }
    private func occAt(_ pos:SIMD2<Float>)->Float { occ[occIdx(pos)] }
    // ink density in a neighbourhood around a point → "is there a stroke near here"
    private func occNear(_ pos:SIMD2<Float>)->Float {
        let g=Float(GRID); let cx=Int(pos.x/g*Float(OC)), cy=Int(pos.y/g*Float(OC))
        var s:Float=0
        for dy in -2...2 { for dx in -2...2 {
            let x=cx+dx, y=cy+dy
            if x>=0 && x<OC && y>=0 && y<OC { s += occ[y*OC+x] }
        }}
        return s
    }

    // Ma-aware placement: spread strokes APART (anti-cluster) so they don't merge, with a gentle
    // off-centre bias → contiguous blank space + off-centre weight (Ma and Yohaku no Bi handles).
    private func chooseOrigin(_ G:Float)->SIMD2<Float> {
        let center = SIMD2<Float>(G/2,G/2)
        var best = center, bestScore:Float = -1e9
        for _ in 0..<20 {
            let cand = SIMD2<Float>(G*(0.14+0.72*nextRand()), G*(0.14+0.72*nextRand()))
            let d = simd_length(cand-center)/G
            let offCenter = 0.30*gauss(d, 0.30, 0.24)   // gentle, wide off-centre preference
            let score = offCenter - 0.45*occNear(cand)  // mild spread — strokes may still cross & interact
            if score>bestScore { bestScore=score; best=cand }
        }
        return best
    }

    private func weightedTone()->Int {           // 墨分五色, biased toward mid/dark
        let r=nextRand(), cum:[Float]=[0.22,0.50,0.74,0.90,1.0]
        for i in 0..<cum.count where r<cum[i] { return i }
        return cum.count-1
    }

    private func spawnOneStroke(_ G:Float) {
        let tones:[Float]=[1.0, 0.74, 0.52, 0.36, 0.22]   // burnt→clear
        let start = chooseOrigin(G)
        let ang = nextRand()*6.2832
        let len = G*(0.32+0.55*nextRand())
        let dir = SIMD2<Float>(cos(ang), sin(ang))
        let perp = SIMD2<Float>(-dir.y, dir.x)
        let c1 = (nextRand()-0.5)*REG.curve*len, c2 = (nextRand()-0.5)*REG.curve*len
        var s = Stroke()
        s.p0 = start
        s.p1 = start + dir*(len*0.33) + perp*c1
        s.p2 = start + dir*(len*0.66) + perp*c2
        s.p3 = start + dir*len + perp*((nextRand()-0.5)*0.15*len)   // small exit offset → resolved direction
        // brush speed (biased fast): fast → thinner line, drawn quicker, drier & more chaotic ends
        let speed = pow(nextRand(), 0.7)               // 0 slow .. 1 fast (biased toward fast)
        let widthScale = mix(1.15, 0.50, speed)        // fast → thin
        let lifeScale  = mix(1.35, 0.50, speed)        // fast → drawn quicker
        let fwScale    = mix(0.6,  1.7,  speed)        // fast → more flying-white / chaotic tail
        let deplScale  = mix(0.8,  1.7,  speed)        // fast → depletes sooner (drier)
        s.start = frame
        s.life = max(Int(len/G * 150 * lifeScale) + 14, 10)
        s.inkConc = tones[weightedTone()]
        let side = nextRand() < REG.sideProb            // 侧锋 side-tip vs 中锋 centre-tip
        s.nibAspect   = side ? (2.0 + 0.5*nextRand()) : (1.3 + 0.3*nextRand())
        s.drynessBias = side ? (0.07 + 0.08*nextRand()) : 0.0
        s.baseR = G/(side ? REG.rSide : REG.rCentre) * (0.7 + 0.4*nextRand()) * widthScale
        s.exitStyle = nextRand() < 0.35 ? 1 : 0
        s.depletion = REG.depletion * deplScale
        s.fwIntensity = REG.fw * fwScale * (0.8 + 0.4*nextRand())
        s.ink = REG.ink * s.inkConc
        s.water = REG.water * (0.6 + 0.4*s.inkConc)   // less carrier → crisper, less perpendicular bleed
        s.seed = nextRand()*60
        s.dir = dir; s.len = len
        strokes.append(s)
        tensionAcc += dir * (len/G)
        // pre-register the stroke footprint so sibling strokes in the same burst avoid overlapping it
        for j in 0...10 { occ[occIdx(bezier(s, Float(j)/10))] += 0.05 }
    }

    // A single very-thin, very-long RED stroke swept across the whole canvas — the final accent,
    // added after the black painting meets its stop criteria. Crosses and sits on top of the ink.
    // max t>0 such that C + t*dir stays inside the inner-margin box [lo,hi]²
    private func edgeDist(_ C:SIMD2<Float>, _ dir:SIMD2<Float>, _ lo:Float, _ hi:Float)->Float {
        var t:Float = 1e9
        for i in 0..<2 {
            let c = C[i], d = dir[i]
            if abs(d) > 1e-4 { t = min(t, d>0 ? (hi-c)/d : (lo-c)/d) }
        }
        return max(t, 0)
    }

    private func spawnRedStroke(_ G:Float) {
        let m:Float = 0.08, lo = m*G, hi = (1-m)*G           // keep both ends inside the canvas
        let ang = nextRand()*6.2832
        let dir = SIMD2<Float>(cos(ang), sin(ang)), perp = SIMD2<Float>(-dir.y, dir.x)
        let center = SIMD2<Float>(G/2,G/2) + perp*((nextRand()-0.5)*0.30*G)
        let tPos = edgeDist(center, dir, lo, hi), tNeg = edgeDist(center, -dir, lo, hi)
        let a = center - dir*tNeg, b = center + dir*tPos    // chord spanning the canvas, endpoints inside
        let bend = (nextRand()-0.5)*0.12*G
        var s = Stroke()
        s.p0 = a
        s.p1 = a + (b-a)*0.33 + perp*bend
        s.p2 = a + (b-a)*0.66 + perp*bend*0.5
        s.p3 = b
        s.start = frame; s.life = 85
        s.baseR = G/300            // very thin
        s.inkConc = 1; s.nibAspect = 1.3; s.drynessBias = 0
        s.depletion = 0.45; s.fwIntensity = 0.18; s.exitStyle = 0
        s.ink = 0.30; s.water = 0.0      // dry paper: pure pigment, no bleed → a clean thin line
        s.seed = nextRand()*60
        s.channel = 1; s.even = true     // RED, even thin sweep
        s.dir = dir; s.len = simd_length(b-a)
        strokes.append(s)
    }

    private func spawnWash(_ G:Float) {
        var s = Stroke()
        let c = SIMD2<Float>(G*(0.25+0.5*nextRand()), G*(0.25+0.5*nextRand()))
        s.p0=c; s.p1=c; s.p2=c; s.p3=c; s.start=frame; s.life=26; s.baseR=G/6; s.wash=true
        strokes.append(s)
    }

    // Painting lifecycle. A painting builds to a few well-placed strokes, holds (the complete
    // image rests — temporal ma), fades to clean paper, then a new painting begins.
    private func spawnStrokes() {
        let G = Float(GRID)
        let fill = occ.reduce(0,+)/Float(occ.count)
        switch phase {
        case .painting:
            inkDecay = 0.9999
            let complete = strokesDone >= strokeTarget || fill > 0.30   // enough strokes OR enough ink
            if !complete && frame >= nextSpawn {
                if burstLeft == 0 { burstLeft = 1 + Int(nextRand()*2) }  // 1–2 strokes per burst (sparser)
                spawnOneStroke(G); strokesDone += 1; burstLeft -= 1
                nextSpawn = frame + (burstLeft>0 ? 10 + Int(nextRand()*16)    // within a burst
                                                 : 40 + Int(nextRand()*70))   // rest between bursts (ma)
            }
            if REG.fw > 0.5 && frame % 500 == 250 && strokesDone < strokeTarget/2 { spawnWash(G) }   // wash only in xieyi
            if complete && strokes.isEmpty { phase = .waiting; phaseStart = frame }
        case .waiting:                                // black settles for ~2s (still bleeding)
            inkDecay = 0.99995
            if frame - phaseStart > WAIT {            // → dry the paper, then sweep the red
                dry = true                            // pigment freezes: black spots stop growing
                spawnRedStroke(G)
                phase = .redding; phaseStart = frame
            }
        case .redding:                               // red sweep draws onto now-dry paper
            inkDecay = 0.99997
            if strokes.isEmpty { phase = .holding; phaseStart = frame }
        case .holding:
            inkDecay = 0.99997                        // the finished painting rests (held image = ma)
            if frame - phaseStart > HOLD { phase = .fading; phaseStart = frame }
        case .fading:
            inkDecay = 0.955                          // dissolve ink → clean paper (~2s)
            if frame - phaseStart > FADE { resetPainting() }
        }
        strokes.removeAll { frame - $0.start > $0.life + 2 }
        for i in occ.indices { occ[i] *= 0.9994 }
        tensionAcc *= 0.995
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
            // ease-in draw-speed: brush presses/dwells at the start (起笔) then accelerates and
            // lifts fast at the exit — keeps the tapered tail sharp (a clean 收笔), not blunted.
            let t0 = pow(max(0,Float(age-1)/Float(s.life)), 1.6)
            let t1 = pow(Float(age)/Float(s.life), 1.6)
            let SUB = 10
            // normalize total deposit by duration → darkness comes from the brush, not from how
            // long the stroke took to draw (otherwise slow strokes oversaturate into black blobs)
            let norm = min(max(70.0/Float(s.life), 0.45), 1.4)
            for k in 1...SUB {
                let t = t0 + (t1 - t0) * Float(k)/Float(SUB)
                let tan = bezierTangent(s, t)
                let dir = simd_length(tan) > 1e-4 ? simd_normalize(tan) : SIMD2<Float>(1,0)
                let load: Float = exp(-s.depletion * t)        // ink depletes along the stroke
                var dp = DepositParams()
                dp.pos = bezier(s, t)
                dp.dir = dir
                let press = s.even ? smoothstep(0,0.05,t)*(1 - smoothstep(0.92,1.0,t))   // even line, sharp tips
                                   : pressure(t, s.exitStyle, s.seed)                    // 起笔/行笔/收笔
                dp.radius = max(s.baseR * press, 0.5)
                dp.ink = s.ink * load * norm
                dp.water = s.water * (0.4 + 0.6*load) * norm
                dp.dryness = min(1 - min(load*1.15, 1) + s.drynessBias, 1)  // side-tip drier → flying white
                dp.seed = s.seed
                dp.nibAspect = s.nibAspect                    // 中锋 round vs 侧锋 broad
                dp.fwIntensity = s.fwIntensity
                dp.channel = Float(s.channel)                 // black or red
                stampDeposit(enc, dp)
                occ[occIdx(dp.pos)] += dp.ink * 0.6           // track laid ink for placement
            }
        }

        // 2. LBE step (stream+collide), f[ff]->f[1-ff], rho[rr]->rho[1-rr], u
        var lp = LbeParams()
        if dry { lp.evap = 0.08 }                 // dry the paper fast → no more percolation
        enc.setComputePipelineState(pLbe)
        enc.setTexture(fA[ff],index:0); enc.setTexture(fB[ff],index:1); enc.setTexture(fC[ff],index:2)
        enc.setTexture(paper,index:3); enc.setTexture(rho[rr],index:4)
        enc.setTexture(fA[1-ff],index:5); enc.setTexture(fB[1-ff],index:6); enc.setTexture(fC[1-ff],index:7)
        enc.setTexture(rho[1-rr],index:8); enc.setTexture(uTex,index:9)
        let lb=bytes(lp); lb.withUnsafeBytes{ enc.setBytes($0.baseAddress!,length:lb.count,index:0) }
        dispatch(enc)
        ff = 1-ff; rr = 1-rr

        // 3. pigment advection p[pp]->p[1-pp]  (decay driven by painting phase: frozen → fade)
        var pgp = PigParams(); pgp.decay = inkDecay
        if dry { pgp.dt = 0 }                     // freeze pigment: black spots stop growing
        enc.setComputePipelineState(pPigment)
        enc.setTexture(p[pp],index:0); enc.setTexture(uTex,index:1); enc.setTexture(rho[rr],index:2)
        enc.setTexture(p[1-pp],index:3)
        let pb=bytes(pgp); pb.withUnsafeBytes{ enc.setBytes($0.baseAddress!,length:pb.count,index:0) }
        dispatch(enc)
        pp = 1-pp

        // 4. display
        var gain: Float = 2.1   // lower → only the dense stroke core reads dark (thin, crisp lines)
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
        scoreFrame(buf, label: path)
    }

    // Eval loop (generate→score): composition metrics from the rendered frame, mirroring the wiki
    // technique pages — negative-space budget + center-of-mass offset (Ma), largest contiguous
    // void, and directed-tension magnitude/angle. Targets: negSpace 30–70%, off-centre COM.
    private func scoreFrame(_ buf:[UInt8], label:String) {
        let N=GRID
        var marked=0; var mx:Float=0; var my:Float=0
        var cell=[Bool](repeating:false, count:24*24)     // coarse marked grid for void search
        for y in 0..<N { for x in 0..<N {
            let i=(y*N+x)*4
            let lum=(0.299*Float(buf[i])+0.587*Float(buf[i+1])+0.114*Float(buf[i+2]))/255
            if lum < 0.80 {                                // darker than paper → ink
                marked+=1; mx+=Float(x); my+=Float(y)
                cell[(y*24/N)*24 + (x*24/N)] = true
            }
        }}
        let total=Float(N*N)
        let negSpace = 1 - Float(marked)/total
        let comOff: Float = marked>0
            ? simd_length(SIMD2<Float>(mx/Float(marked), my/Float(marked)) - SIMD2<Float>(Float(N)/2,Float(N)/2))/Float(N)
            : 0
        // largest contiguous empty region (flood fill over the 24×24 unmarked cells)
        var seen=[Bool](repeating:false, count:24*24); var largest=0
        for s in 0..<(24*24) where !cell[s] && !seen[s] {
            var stack=[s]; seen[s]=true; var sz=0
            while let c=stack.popLast() {
                sz+=1; let cx=c%24, cy=c/24
                for (dx,dy) in [(-1,0),(1,0),(0,-1),(0,1)] {
                    let nx=cx+dx, ny=cy+dy
                    if nx>=0&&nx<24&&ny>=0&&ny<24 { let n=ny*24+nx; if !cell[n] && !seen[n] { seen[n]=true; stack.append(n) } }
                }
            }
            largest=max(largest,sz)
        }
        let voidFrac = Float(largest)/Float(24*24)
        let tension = simd_length(tensionAcc)
        let angle = tension>1e-4 ? atan2(tensionAcc.y, tensionAcc.x)*180/Float.pi : 0
        let ok = { (b:Bool)->String in b ? "✓" : "✗" }
        FileHandle.standardError.write("""
        wrote \(label) after \(frame) frames
          scorecard (wiki: Ma / Negative-Space / Directed-Tension)
            negative-space   \(String(format:"%.0f%%",negSpace*100))   target 30–70%  \(ok(negSpace>=0.30 && negSpace<=0.70))
            largest void     \(String(format:"%.0f%%",voidFrac*100))   contiguous active emptiness
            COM off-centre   \(String(format:"%.3f",comOff))    target >0.04 off-centre  \(ok(comOff>0.04))
            directed-tension \(String(format:"%.2f",tension)) @ \(String(format:"%.0f°",angle))   (resolved gesture energy)

        """.data(using:.utf8)!)
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
