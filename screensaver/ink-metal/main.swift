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
// NOTE: `water` is tiny — an ink stroke barely self-wets, so on DRY paper it stays crisp.
// Bleed/merge happens where the paper is already wet (from the clear-water strokes). This is what
// makes the wet-% / water-stroke-count dials actually control wetness.
let GONGBI = Register(sideProb:0.16, water:0.004, ink:0.30, depletion:0.7, fw:0.22, rCentre:170, rSide:120, curve:0.34, permContrast:0.40)
let XIEYI  = Register(sideProb:0.45, water:0.020, ink:0.26, depletion:1.9, fw:1.0,  rCentre:140, rSide:100, curve:0.52, permContrast:1.0)

// Live-tunable settings (shared with the GUI). The renderer snapshots these at each painting
// RESET, so edits never disturb the painting in progress — they take effect on the next one.
final class Settings {
    var register   = CommandLine.arguments.contains("--xieyi") ? 1 : 0   // 0 gongbi, 1 xieyi
    var wetPercent: Float = 0.18     // size of each clear-water stroke (wet area on otherwise dry paper)
    var waterStrokes = 1             // number of clear-water strokes (0–5)
    var strokeCount = 6              // black strokes before the red accent
    var redOn = true
    var avgSpeed:   Float = 0.62     // 0 slow/thick .. 1 fast/thin
    var vigor:      Float = 0.55     // 0 calm .. 1 vigorous (speed + flying-white + curvature + splatter)
    var splatter:   Float = 0.45     // 0 none .. 1 heavy 潑墨 droplets off vigorous/loaded strokes
    var lengthScale:Float = 1.0      // stroke-length multiplier (≈0.6–1.4)
    var holdSeconds:Float = 5.0      // how long the finished painting holds
}
let settings = Settings()

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
    float r0 = 0.0;                         // start fully DRY; wetness comes from a water stroke
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
    float ee = dot(e,e);
    // Tight gaussian falloff → crisp thin stroke (not a wide soft halo). A hard `g < cutoff`
    // truncation would show its elliptical boundary as a hard geometric edge whenever the stamp is
    // heavily loaded (the value AT the cutoff still reads as ink). So window g smoothly to zero at
    // the rim instead — the footprint always fades out, regardless of how dark the core is.
    float g = exp(-ee*3.0) * smoothstep(2.2, 1.1, ee);
    if(g < 0.0015) return;

    // Dry-brush flying-white (飛白): as the ink load runs out the bristles separate and the paper
    // shows through as streaks running ALONG travel — continuous PARALLEL HAIRS, not dashes across
    // the stroke. A hair sits at a fixed offset ACROSS the width, so the pattern keys on loc.y
    // (perpendicular) and stays constant along loc.x. Because loc.y is the same for every overlapping
    // sub-stamp, the hairs come out continuous instead of the beaded "railroad tracks" a loc.x-keyed
    // pattern produces. Depletion (dryness↑ toward the tail) opens the gaps — not an along-length chop.
    float fw = dp.fwIntensity * smoothstep(0.40, 0.92, dp.dryness);
    float mask = 1.0;
    if (fw > 0.001) {
        float hairs = vnoise(float2(dp.seed, loc.y*0.80));                    // fine stripes across width
        float group = vnoise(float2(loc.x*0.010 + dp.seed*1.7, loc.y*0.28));  // slow clumping (very gentle along-wobble)
        float bristle = hairs*0.66 + group*0.34;
        float thr = mix(0.30, 0.72, fw);                       // drier → higher threshold → more paper shows
        float keep = smoothstep(thr-0.12, thr+0.12, bristle);  // 1 = hair, 0 = paper gap
        mask = mix(1.0, keep, fw);
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

struct PigParams { float dt; float gammaMove; float velThr; float decay; float wetThr; float diff; };

// pigment advection (method of characteristics, flow-speed hindrance) + wetness-gated diffusion
// so that where two WET inks meet they blend/merge across the boundary instead of one's water
// pushing the other back (a harsh backrun).
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
    float2 c = (float2(gid)+0.5)/size;
    float2 pHere = pIn.sample(samp, c).xy;
    float speed = length(u);
    // gamma -> 1 (stay/pinned) when slow, -> gammaMove when fast
    float gamma = mix(1.0, pp.gammaMove, smoothstep(0.0, pp.velThr, speed));
    float2 pNew = mix(pStar, pHere, gamma);
    // diffusion: blend with neighbours, but ONLY where the paper is wet (so dry/settled ink keeps
    // its shape). Lets inks merge where they meet; vanishes as the paper dries.
    float wet = rho.read(gid).x;
    float wgate = smoothstep(pp.wetThr, pp.wetThr+0.12, wet);
    if (pp.diff > 0.0 && wgate > 0.0) {
        float2 t = 1.0/size;
        float2 lap = pIn.sample(samp, c+float2(-t.x,0)).xy + pIn.sample(samp, c+float2(t.x,0)).xy
                   + pIn.sample(samp, c+float2(0,-t.y)).xy + pIn.sample(samp, c+float2(0,t.y)).xy
                   - 4.0*pHere;
        pNew += pp.diff * wgate * lap;
    }
    pNew *= pp.decay;                                  // slow fade / fast during the fade phase
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
struct PigParams { var dt:Float=1.0; var gammaMove:Float=0.35; var velThr:Float=0.02; var decay:Float=0.99965; var wetThr:Float=0.04; var diff:Float=0.06 }  // diff low → solid, non-watery blacks; softness reserved for wet areas + gray washes

// A calligraphic sumi stroke: a cubic Bézier centerline drawn over `life` frames. Carries
// brush dynamics — three-phase pressure (起笔/行笔/收笔), centre/side-tip nib, ink tone
// (墨分五色), and a per-stroke seed driving organic micro-variation.
// 墨分五色 as stroke archetypes (see [[Chinese Brushwork Principles]] physical-dynamics layer):
// 焦 thinLine = crisp dark "bone" · 浓 dark = solid structure · 淡 grayWash = broad soft background
// tone · 枯 vigorousDry = fast, low-moisture, strong flying-white + splatter.
enum Kind { case grayWash, thinLine, dark, vigorousDry }

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
    var kind:Kind = .dark        // 五色 archetype (drives the per-kind character)
    var snap:Float=0             // 0 = smooth, 1 = vigorous: sharper entry press + faster exit
    var splatter:Float=0         // 潑墨 droplet amount flicked off the brush (0 = none)
    var dir=SIMD2<Float>(1,0), len:Float=0   // overall gesture (for directed-tension accumulator)
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
func pressure(_ t:Float,_ exitStyle:Int,_ seed:Float,_ snap:Float)->Float {
    let entry = smoothstep(0, mix(0.09, 0.05, snap), t)       // snap → establish width faster
    let taper = 1 - smoothstep(mix(0.74, 0.60, snap), 1.0, t) // snap → exit sooner / lift faster
    let accent = (0.16 + 0.26*snap) * gauss(t, 0.06, 0.045)   // 藏锋 press; snap → firmer landing (not a lollipop)
    let wobble = 1 + (0.08+0.06*snap)*(sin(t*9+seed)*0.6 + sin(t*17+seed*1.7)*0.4)   // organic body variation
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
    var nextSpawn = 0
    var kindPlan: [Kind] = []                 // the painting's stroke recipe, popped one per spawn (one painter)
    var tensionAcc = SIMD2<Float>(0,0)        // decaying sum of stroke gesture vectors

    // painting lifecycle: paint black → wait (settle) → dry+red → hold → fade → new painting
    enum Phase { case painting, waiting, redding, holding, fading }
    var phase: Phase = .painting
    var phaseStart = 0
    var strokesDone = 0, strokeTarget = 7
    var dry = false                           // paper dried: pigment frozen (black stops growing)
    var inkDecay: Float = 0.9999              // driven by phase; fast during fade
    var paperSeed: Float = 0
    let WAIT = 120, FADE = 130                // frames (~60fps): wait ~2s, fade ~2.2s

    // snapshot of Settings, taken at each reset (so edits apply only to the next painting)
    var reg = GONGBI
    var aSpeed:Float = 0.62, aLen:Float = 1.0, aWet:Float = 0.18
    var aVigor:Float = 0.55, aSplatter:Float = 0.45
    var aRedOn = true, aHold = 300, aWaterN = 1

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
        resetPainting()      // first painting: snapshot settings, paper, water area
    }

    private func nextRand()->Float { rng ^= rng<<13; rng ^= rng>>7; rng ^= rng<<17; return Float(rng % 10000)/10000.0 }

    private func seed() {
        ff=0; rr=0; pp=0
        let cb=queue.makeCommandBuffer()!, enc=cb.makeComputeCommandEncoder()!
        enc.setComputePipelineState(pGen); enc.setTexture(paper,index:0)
        var contrast = reg.permContrast, sd = paperSeed
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

    // snapshot the live Settings (so edits apply only to the NEXT painting, never mid-stroke)
    private func applySettings() {
        reg = settings.register == 1 ? XIEYI : GONGBI
        aSpeed = settings.avgSpeed; aLen = settings.lengthScale; aWet = settings.wetPercent
        aVigor = settings.vigor; aSplatter = settings.splatter
        aRedOn = settings.redOn; aHold = max(30, Int(settings.holdSeconds*60))
        aWaterN = settings.waterStrokes
        strokeTarget = max(1, settings.strokeCount)
    }

    // a single CLEAR-WATER stroke (ink-free) laid first → the one wet area on otherwise dry paper.
    private func spawnWaterStroke(_ G:Float) {
        if aWet < 0.01 { return }
        let m:Float = 0.12, lo=m*G, hi=(1-m)*G
        let ang = nextRand()*6.2832
        let dir = SIMD2<Float>(cos(ang),sin(ang)), perp = SIMD2<Float>(-dir.y,dir.x)
        let center = SIMD2<Float>(G/2,G/2) + perp*((nextRand()-0.5)*0.30*G)
        let lenFrac = 0.30 + 1.4*aWet                 // wetPercent scales how far it reaches
        let a = center - dir*edgeDist(center,-dir,lo,hi)*lenFrac
        let b = center + dir*edgeDist(center, dir,lo,hi)*lenFrac
        let bend = (nextRand()-0.5)*0.10*G
        var s = Stroke()
        s.p0=a; s.p1=a+(b-a)*0.33+perp*bend; s.p2=a+(b-a)*0.66+perp*bend*0.5; s.p3=b
        s.start=frame; s.life=46
        s.baseR = G*(0.025 + 0.12*aWet)               // width scales with wetPercent
        s.water = 0.07; s.ink = 0; s.even = true; s.nibAspect = 1.7
        s.depletion = 0.2; s.fwIntensity = 0; s.seed = nextRand()*60
        s.dir=dir; s.len=simd_length(b-a)
        strokes.append(s)
    }

    // begin a fresh painting: snapshot settings, new paper, cleared ink, lay the wet area
    private func resetPainting() {
        applySettings()
        paperSeed += 13.7
        seed()
        for i in occ.indices { occ[i]=0 }
        tensionAcc = SIMD2<Float>(0,0)
        strokes.removeAll(); strokesDone = 0; dry = false
        nextSpawn = frame + 24
        kindPlan = buildKindPlan(strokeTarget)                  // grays first (background), blacks over
        for _ in 0..<aWaterN { spawnWaterStroke(Float(GRID)) }   // the wet area(s), before any ink
        phase = .painting; phaseStart = frame
    }

    // The painting recipe: a few gray washes laid first as background tone, then the blacks
    // (a crisp thinLine "bone" + a vigorousDry + a shuffled mix). 五色 expressed as stroke kinds.
    private func buildKindPlan(_ n:Int)->[Kind] {
        var plan:[Kind] = []
        let grays = min(max(0, n-1), n >= 4 ? 1 + Int(nextRand()*2) : (nextRand()<0.5 ? 1 : 0))
        for _ in 0..<grays { plan.append(.grayWash) }
        var blacks:[Kind] = []
        let rest = n - grays
        for i in 0..<rest {
            if i == 0 { blacks.append(.thinLine) }                       // always a structural bone
            else if i == 1 && rest >= 3 { blacks.append(.vigorousDry) }  // and one vigorous dry stroke
            else { let r=nextRand(); blacks.append(r<0.4 ? .dark : (r<0.72 ? .thinLine : .vigorousDry)) }
        }
        for i in stride(from:blacks.count-1, through:1, by:-1) {         // shuffle the blacks
            let j = Int(nextRand()*Float(i+1)); blacks.swapAt(i, j)
        }
        plan.append(contentsOf: blacks)
        return plan
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

    // Lay one stroke of a given 五色 archetype. Speed↔moisture↔value are coupled (the engine of
    // vigor): fast+dry → thin, flying-white, light; slow+saturated → broad, soft, dark. The Vigor
    // dial pushes the dynamic kinds harder (speed, flying-white, curvature, splatter).
    private func spawnOneStroke(_ G:Float, _ kind:Kind) {
        let vig = aVigor
        let dynamic = kind != .grayWash                 // grays stay calm regardless of vigor
        // per-kind character: speed, ink concentration, width/water/fw/curve/depletion/splatter muls
        let speedBase:Float, conc:Float, widthMul:Float, waterMul:Float, lenMul:Float
        let fwMul:Float, curveMul:Float, deplMul:Float, splatBase:Float, sideTip:Bool, snap:Float
        switch kind {
        case .thinLine:                                  // 焦 — crisp dark structural "bone": long, thin, SOLID
            speedBase=0.88; conc=1.0;  widthMul=0.52; waterMul=0.4; lenMul=1.1; fwMul=0.10; curveMul=0.7; deplMul=0.4; splatBase=0.05; sideTip=false; snap=1
        case .dark:                                      // 浓 — solid, confident structure (too thin for parallel hairs → keep solid)
            speedBase=0.55; conc=0.92; widthMul=0.82; waterMul=0.8; lenMul=0.85;fwMul=0.22; curveMul=1.0; deplMul=0.8; splatBase=0.18; sideTip=false; snap=0.4
        case .grayWash:                                  // 淡 — broad pale soft background tone
            speedBase=0.28; conc=0.15; widthMul=1.5;  waterMul=1.7; lenMul=0.9; fwMul=0.25; curveMul=0.8; deplMul=0.5; splatBase=0.0;  sideTip=true;  snap=0
        case .vigorousDry:                               // 枯 — fast dry DRAG: broad, side-tip, breaks into flying-white hairs
            speedBase=0.80; conc=0.95; widthMul=1.7;  waterMul=0.30;lenMul=0.95;fwMul=2.2;  curveMul=1.3; deplMul=1.5; splatBase=0.9;  sideTip=true;  snap=1
        }
        let speed = min(max(speedBase + (dynamic ? vig*0.18 : 0) + (nextRand()-0.5)*0.28, 0), 1)
        let widthScale = mix(1.15, 0.50, speed) * widthMul
        let lifeScale  = mix(1.35, 0.55, speed)
        let fwScale    = mix(0.6,  1.7,  speed)
        let deplScale  = mix(0.8,  1.7,  speed)

        let start = chooseOrigin(G)
        let ang = nextRand()*6.2832
        let len = G*(0.24+0.42*nextRand())*lenMul*aLen
        let dir = SIMD2<Float>(cos(ang), sin(ang))
        let perp = SIMD2<Float>(-dir.y, dir.x)
        let curveAmt = reg.curve * curveMul * (dynamic ? (1 + vig*0.5) : 1)
        let c1 = (nextRand()-0.5)*curveAmt*len, c2 = (nextRand()-0.5)*curveAmt*len
        var s = Stroke()
        s.kind = kind
        s.p0 = start
        s.p1 = start + dir*(len*0.33) + perp*c1
        s.p2 = start + dir*(len*0.66) + perp*c2
        s.p3 = start + dir*len + perp*((nextRand()-0.5)*0.15*len)   // small exit offset → resolved direction
        s.start = frame
        s.life = max(Int(len/G * 150 * lifeScale) + 14, 10)
        s.inkConc = conc
        s.nibAspect   = sideTip ? (2.2 + 0.6*nextRand()) : (1.3 + 0.3*nextRand())  // 侧锋 broad vs 中锋 round
        s.drynessBias = sideTip ? (0.06 + 0.06*nextRand()) : 0.0
        s.baseR = G/(sideTip ? reg.rSide : reg.rCentre) * (0.8 + 0.3*nextRand()) * widthScale
        s.exitStyle = snap > 0.5 ? 0 : (nextRand() < 0.35 ? 1 : 0)   // vigorous strokes lift to a taper, not a hook
        s.snap = snap
        s.depletion = reg.depletion * deplScale * deplMul
        s.fwIntensity = reg.fw * fwScale * fwMul * (0.8 + 0.4*nextRand()) * (dynamic ? (1 + vig*1.2) : 1)
        s.splatter = min(splatBase * aSplatter * (0.5 + vig), 1.0)
        s.ink = reg.ink * conc
        s.water = reg.water * waterMul * (0.6 + 0.4*conc)   // grays carry more water (soft); blacks ~dry
        s.seed = nextRand()*60
        s.dir = dir; s.len = len
        strokes.append(s)
        tensionAcc += dir * (len/G)
        // register the footprint so the next stroke's placement avoids overlapping it
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
        s.start = frame; s.life = 55            // ≤ ~1s to paint
        s.baseR = G/300            // very thin
        s.inkConc = 1; s.nibAspect = 1.3; s.drynessBias = 0
        s.depletion = 0.45; s.fwIntensity = 0.18; s.exitStyle = 0
        s.ink = 0.30; s.water = 0.0      // dry paper: pure pigment, no bleed → a clean thin line
        s.seed = nextRand()*60
        s.channel = 1; s.even = true     // RED, even thin sweep
        s.dir = dir; s.len = simd_length(b-a)
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
            // ONE PAINTER: the next stroke begins only after the current one has fully lifted
            // (strokes empty), plus a short "breath". No two strokes draw at once.
            let complete = strokesDone >= strokeTarget || fill > 0.34
            if strokes.isEmpty {
                if !complete && frame >= nextSpawn {
                    let kind = strokesDone < kindPlan.count ? kindPlan[strokesDone] : .dark
                    spawnOneStroke(G, kind); strokesDone += 1
                } else if complete {
                    phase = .waiting; phaseStart = frame
                }
            } else {
                nextSpawn = frame + 16 + Int(nextRand()*22)   // breath starts ticking when the brush lifts
            }
        case .waiting:                                // black settles for ~2s (still bleeding)
            inkDecay = 0.99995
            if frame - phaseStart > WAIT {            // → dry the paper, then sweep the red
                dry = true                            // pigment freezes: black spots stop growing
                if aRedOn { spawnRedStroke(G); phase = .redding }
                else { phase = .holding }
                phaseStart = frame
            }
        case .redding:                               // red sweep draws onto now-dry paper
            inkDecay = 0.99997
            if strokes.isEmpty { phase = .holding; phaseStart = frame }
        case .holding:
            inkDecay = 0.99997                        // the finished painting rests (held image = ma)
            if frame - phaseStart > aHold { phase = .fading; phaseStart = frame }
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
            // ease-in draw-speed: brush presses/dwells at the start (起笔) then accelerates and
            // lifts fast at the exit — keeps the tapered tail sharp (a clean 收笔), not blunted.
            // ease-in dwell sharpens tapered tails, but a strong dwell piles stamps at the origin
            // (a "tadpole" head). Vigorous (snap) strokes attack immediately → near-linear easing.
            let ez = mix(1.6, 1.02, s.snap)
            let t0 = pow(max(0,Float(age-1)/Float(s.life)), ez)
            let t1 = pow(Float(age)/Float(s.life), ez)
            let SUB = 10
            var prevPos = bezier(s, t0)
            for k in 1...SUB {
                let t = t0 + (t1 - t0) * Float(k)/Float(SUB)
                let curPos = bezier(s, t)
                let seg = simd_length(curPos - prevPos); prevPos = curPos   // distance moved this substamp
                let tan = bezierTangent(s, t)
                let dir = simd_length(tan) > 1e-4 ? simd_normalize(tan) : SIMD2<Float>(1,0)
                let load: Float = exp(-s.depletion * t)        // ink depletes along the stroke
                var dp = DepositParams()
                dp.pos = curPos
                dp.dir = dir
                let press = s.even ? smoothstep(0,0.05,t)*(1 - smoothstep(0.92,1.0,t))   // even line, sharp tips
                                   : pressure(t, s.exitStyle, s.seed, s.snap)            // 起笔/行笔/收笔 (snap = vigor)
                dp.radius = max(s.baseR * press, 0.5)
                // dose ∝ distance the brush MOVED (not frame/substamp count): a slow or short stroke
                // no longer piles overlapping stamps into an oversaturated blob. Darkness comes from
                // the brush load + how many times the sweeping nib overlaps a point, as in real ink.
                let dose = min(seg / max(s.baseR, 1.0), 1.6) * 2.3
                dp.ink = s.ink * load * dose
                dp.water = s.water * (0.4 + 0.6*load) * dose
                dp.dryness = min(1 - min(load*1.15, 1) + s.drynessBias, 1)  // side-tip drier → flying white
                dp.seed = s.seed
                dp.nibAspect = s.nibAspect                    // 中锋 round vs 侧锋 broad
                dp.fwIntensity = s.fwIntensity
                dp.channel = Float(s.channel)                 // black or red
                stampDeposit(enc, dp)
                occ[occIdx(dp.pos)] += dp.ink * 0.6           // track laid ink for placement
            }

            // 潑墨 splatter: tiny dark specks flicked off a vigorous/loaded brush — a burst at the
            // landing (起笔) and a scatter along the path, biased forward (the flick). Pure pigment,
            // no water → hard dots that don't bleed. (Black channel only.)
            if s.splatter > 0 && s.channel == 0 {
                let landing: Float = age < 6 ? 2.6 : 1.0      // heavier at the brush landing
                let tip = bezier(s, t1)
                let tan = bezierTangent(s, t1)
                let fdir = simd_length(tan) > 1e-4 ? simd_normalize(tan) : SIMD2<Float>(1,0)
                let fperp = SIMD2<Float>(-fdir.y, fdir.x)
                let tries = Int(s.splatter * landing * 3) + 1
                for _ in 0..<tries {
                    if nextRand() > s.splatter * 0.6 + 0.12 { continue }   // sparse — mostly skips
                    let along  = (nextRand()-0.15) * 16 * s.splatter       // biased forward (the flick)
                    let across = (nextRand()-0.5)  * 11 * s.splatter
                    var sp = DepositParams()
                    sp.pos = tip + fdir*along + fperp*across
                    sp.dir = fdir
                    sp.radius = 0.6 + 1.3*nextRand()           // tiny speck
                    sp.ink = s.ink * (0.5 + 0.8*nextRand())
                    sp.water = 0; sp.dryness = 0; sp.seed = s.seed
                    sp.nibAspect = 1.0; sp.fwIntensity = 0; sp.channel = 0
                    stampDeposit(enc, sp)
                }
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
    for arg in a {   // optional overrides for headless tuning, e.g. --waterN=0 --wet=0.05
        if arg.hasPrefix("--wet=")    { settings.wetPercent  = Float(arg.dropFirst(6)) ?? settings.wetPercent }
        if arg.hasPrefix("--waterN=") { settings.waterStrokes = Int(arg.dropFirst(9)) ?? settings.waterStrokes }
        if arg.hasPrefix("--speed=")  { settings.avgSpeed     = Float(arg.dropFirst(8)) ?? settings.avgSpeed }
        if arg.hasPrefix("--vigor=")  { settings.vigor        = Float(arg.dropFirst(8)) ?? settings.vigor }
        if arg.hasPrefix("--splatter="){ settings.splatter    = Float(arg.dropFirst(11)) ?? settings.splatter }
        if arg.hasPrefix("--count=")  { settings.strokeCount  = Int(arg.dropFirst(8)) ?? settings.strokeCount }
    }
    Renderer(device:device).renderToPNG(frames:frames, path:path)
    exit(0)
}

final class InkView: MTKView {
    override var acceptsFirstResponder: Bool { true }
    override func keyDown(with e: NSEvent) { if e.keyCode==53 || e.charactersIgnoringModifiers=="q" { NSApp.terminate(nil) } }
}

final class FlippedView: NSView { override var isFlipped: Bool { true } }

// A small controls window for the parameters we keep tuning. Writes into the shared `settings`;
// the renderer snapshots those at each painting reset, so edits take effect on the NEXT painting.
final class ControlPanel: NSObject {
    let s: Settings
    let win: NSWindow
    let content = FlippedView(frame: NSRect(x:0,y:0,width:280,height:540))
    let reg = NSSegmentedControl(labels:["Gongbi","Xieyi"], trackingMode:.selectOne, target:nil, action:nil)
    let red = NSButton(checkboxWithTitle:"Red accent", target:nil, action:nil)
    var wet=NSSlider(), waterN=NSSlider(), count=NSSlider(), speed=NSSlider(), vigor=NSSlider(), splat=NSSlider(), length=NSSlider(), hold=NSSlider()
    var vWet=NSTextField(), vWaterN=NSTextField(), vCount=NSTextField(), vSpeed=NSTextField(), vVigor=NSTextField(), vSplat=NSTextField(), vLength=NSTextField(), vHold=NSTextField()

    init(settings: Settings) {
        s = settings
        win = NSWindow(contentRect: content.frame, styleMask:[.titled,.closable], backing:.buffered, defer:false)
        super.init()
        win.title = "Ink controls"; win.contentView = content
        func lbl(_ t:String,_ x:CGFloat,_ y:CGFloat,_ w:CGFloat,_ right:Bool=false)->NSTextField {
            let l=NSTextField(labelWithString:t); l.font = .systemFont(ofSize:11)
            l.frame = NSRect(x:x,y:y,width:w,height:16); if right { l.alignment = .right }
            content.addSubview(l); return l
        }
        func slider(_ title:String,_ mn:Double,_ mx:Double,_ v:Double,_ y:CGFloat)->(NSSlider,NSTextField) {
            _ = lbl(title, 14, y, 170); let vl = lbl("", 180, y, 86, true)
            let sl = NSSlider(value:v, minValue:mn, maxValue:mx, target:self, action:#selector(changed))
            sl.frame = NSRect(x:14, y:y+18, width:252, height:20); content.addSubview(sl)
            return (sl, vl)
        }
        _ = lbl("Register", 14, 14, 80)
        reg.frame = NSRect(x:14, y:32, width:160, height:24); reg.target=self; reg.action=#selector(changed)
        reg.selectedSegment = s.register; content.addSubview(reg)
        red.frame = NSRect(x:184, y:34, width:90, height:20); red.target=self; red.action=#selector(changed)
        red.state = s.redOn ? .on : .off; content.addSubview(red)
        (wet,   vWet)    = slider("Wet area size",       0.0, 0.5, Double(s.wetPercent),   78)
        (waterN,vWaterN) = slider("Clear-water strokes", 0,   5,   Double(s.waterStrokes), 130)
        (count, vCount)  = slider("Strokes before red",  1,  12,   Double(s.strokeCount),  182)
        (speed, vSpeed)  = slider("Avg stroke speed",    0.0, 1.0, Double(s.avgSpeed),     234)
        (vigor, vVigor)  = slider("Vigor",               0.0, 1.0, Double(s.vigor),        286)
        (splat, vSplat)  = slider("Splatter",            0.0, 1.0, Double(s.splatter),     338)
        (length,vLength) = slider("Stroke length",       0.5, 1.5, Double(s.lengthScale),  390)
        (hold,  vHold)   = slider("Hold seconds",        1.0, 10.0,Double(s.holdSeconds),  442)
        _ = lbl("changes apply on the next painting", 14, 498, 252)
        updateValues()
        win.makeKeyAndOrderFront(nil)
    }
    private func updateValues() {
        vWet.stringValue = String(format:"%.0f%%", s.wetPercent*100)
        vWaterN.stringValue = "\(s.waterStrokes)"
        vCount.stringValue = "\(s.strokeCount)"
        vSpeed.stringValue = String(format:"%.2f", s.avgSpeed)
        vVigor.stringValue = String(format:"%.2f", s.vigor)
        vSplat.stringValue = String(format:"%.2f", s.splatter)
        vLength.stringValue = String(format:"%.2f×", s.lengthScale)
        vHold.stringValue = String(format:"%.1fs", s.holdSeconds)
    }
    @objc func changed() {
        s.register = reg.selectedSegment
        s.redOn = (red.state == .on)
        s.wetPercent = wet.floatValue
        s.waterStrokes = Int(waterN.doubleValue.rounded())
        s.strokeCount = Int(count.doubleValue.rounded())
        s.avgSpeed = speed.floatValue
        s.vigor = vigor.floatValue
        s.splatter = splat.floatValue
        s.lengthScale = length.floatValue
        s.holdSeconds = hold.floatValue
        updateValues()
    }
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
let panel = ControlPanel(settings: settings)
let wf = window.frame
panel.win.setFrameOrigin(NSPoint(x: wf.maxX + 12, y: wf.maxY - panel.win.frame.height))   // to the right
app.activate(ignoringOtherApps: true)
app.run()
_ = panel
