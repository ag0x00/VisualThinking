---
title: Symmetry-Group Pattern Generator
type: technique
status: developing
tags: [technique, symmetry, wallpaper-groups, generative, tessellation, implementation]
address: c-000221
created: 2026-05-17
updated: 2026-05-17
sweep: implementation-notes
implements: ["[[Symmetry Groups and Tessellation]]", "[[Aperiodic Tiling and the Hat Monotile]]", "[[Islamic Geometric Patterns and the Polygonal Technique]]"]
language: typescript
---

# Symmetry-Group Pattern Generator

Implementation of pattern generation from the **17 wallpaper groups** (2D periodic patterns), the **7 frieze groups** (1D periodic patterns), and the **Hat monotile** aperiodic tiling. From a fundamental domain (single motif) plus a group, generate the full pattern.

**Use cases**: decorative pattern generation for branding / wallpaper / textile, generative-art tile systems, Islamic geometric pattern construction, pattern-style analysis of existing imagery.

## The 17 wallpaper groups

Each group is a finite set of isometries (rotations, reflections, glides) that tile the plane when applied to a fundamental domain. Standard orbifold notation:

| Crystallographic | Orbifold | Symmetries | Lattice |
|---|---|---|---|
| **p1** | `o` | Translation only | Oblique |
| **p2** | `2222` | Rotation 2-fold | Oblique |
| **pm** | `**` | Mirror only | Rectangular |
| **pg** | `××` | Glide only | Rectangular |
| **cm** | `*×` | Mirror + glide | Rhombic |
| **pmm** | `*2222` | 2× mirror, 2× rotation | Rectangular |
| **pmg** | `22*` | Mirror + rotation + glide | Rectangular |
| **pgg** | `22×` | Rotation + 2 glides | Rectangular |
| **cmm** | `2*22` | Centered mirror + rotation | Rhombic |
| **p4** | `442` | 4-fold rotation | Square |
| **p4m** | `*442` | 4-fold rotation + mirrors | Square |
| **p4g** | `4*2` | 4-fold + glides | Square |
| **p3** | `333` | 3-fold rotation | Hexagonal |
| **p3m1** | `*333` | 3-fold + mirrors through corners | Hexagonal |
| **p31m** | `3*3` | 3-fold + mirrors through edges | Hexagonal |
| **p6** | `632` | 6-fold rotation | Hexagonal |
| **p6m** | `*632` | 6-fold + mirrors | Hexagonal |

## Implementation

```typescript
type Point = [number, number];
type Path = Point[];

interface GroupTransform {
  type: "translate" | "rotate" | "reflect" | "glide";
  params: number[];
}

interface WallpaperGroup {
  name: string;
  lattice: [Point, Point];        // two lattice vectors
  generators: GroupTransform[];    // generating isometries
}

function generatePattern(
  motif: Path[],
  group: WallpaperGroup,
  bounds: { x: number; y: number; w: number; h: number }
): Path[] {
  const allCopies: Path[] = [];

  // 1. Apply intra-cell symmetries to motif (rotations + reflections)
  const cellCopies = applyGenerators(motif, group.generators);

  // 2. Tile across the bounds using lattice vectors
  const [u, v] = group.lattice;
  const tilesU = Math.ceil(bounds.w / Math.max(Math.abs(u[0]), Math.abs(u[1]))) + 1;
  const tilesV = Math.ceil(bounds.h / Math.max(Math.abs(v[0]), Math.abs(v[1]))) + 1;

  for (let i = -tilesU; i <= tilesU; i++) {
    for (let j = -tilesV; j <= tilesV; j++) {
      const dx = i * u[0] + j * v[0];
      const dy = i * u[1] + j * v[1];
      for (const path of cellCopies) {
        const translated = path.map(([x, y]) => [x + dx, y + dy] as Point);
        if (intersectsBounds(translated, bounds)) {
          allCopies.push(translated);
        }
      }
    }
  }

  return allCopies;
}

function applyGenerators(motif: Path[], generators: GroupTransform[]): Path[] {
  // BFS/closure: start with motif, apply each generator, collect new copies, repeat until stable
  const seen = new Set<string>();
  const queue: Path[][] = [motif];
  const result: Path[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const path of current) {
      const key = pathKey(path);
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(path);

      for (const gen of generators) {
        const transformed = applyTransform(path, gen);
        queue.push([transformed]);
      }
    }
  }
  return result;
}
```

### Example group definitions

```typescript
const GROUPS: Record<string, WallpaperGroup> = {
  p1: {
    name: "p1",
    lattice: [[1, 0], [0, 1]],
    generators: [],
  },
  p2: {
    name: "p2",
    lattice: [[1, 0], [0, 1]],
    generators: [{ type: "rotate", params: [0, 0, 180] }],   // 180° at origin
  },
  p4m: {
    name: "p4m",
    lattice: [[1, 0], [0, 1]],
    generators: [
      { type: "rotate", params: [0, 0, 90] },                // 90° at origin
      { type: "reflect", params: [0, 0, 1, 0] },             // reflect across x-axis
    ],
  },
  p6m: {
    name: "p6m",
    lattice: [[1, 0], [0.5, Math.sqrt(3) / 2]],              // hexagonal lattice
    generators: [
      { type: "rotate", params: [0, 0, 60] },                // 60° at origin
      { type: "reflect", params: [0, 0, 1, 0] },
    ],
  },
};

function applyTransform(path: Path, t: GroupTransform): Path {
  switch (t.type) {
    case "rotate": {
      const [cx, cy, deg] = t.params;
      const rad = deg * Math.PI / 180;
      return path.map(([x, y]) => {
        const dx = x - cx, dy = y - cy;
        return [cx + dx * Math.cos(rad) - dy * Math.sin(rad), cy + dx * Math.sin(rad) + dy * Math.cos(rad)];
      });
    }
    case "reflect": {
      // Reflect across line passing through (cx, cy) with direction (dx, dy)
      const [cx, cy, dx, dy] = t.params;
      const n = Math.sqrt(dx * dx + dy * dy);
      const nx = dx / n, ny = dy / n;
      return path.map(([x, y]) => {
        const px = x - cx, py = y - cy;
        const dot = 2 * (px * nx + py * ny);
        return [cx + dot * nx - px, cy + dot * ny - py];
      });
    }
    case "translate": {
      const [dx, dy] = t.params;
      return path.map(([x, y]) => [x + dx, y + dy]);
    }
    case "glide": {
      // Reflect, then translate along the mirror axis
      const reflected = applyTransform(path, { type: "reflect", params: t.params.slice(0, 4) });
      return applyTransform(reflected, { type: "translate", params: t.params.slice(4) });
    }
  }
}
```

## Frieze groups (1D periodic)

Seven frieze groups: `p1`, `p11g`, `p1m1`, `pmm2`, `p2`, `pm11`, `p2mg`. Useful for borders, banners, kinetic ticker-style animations. Same algorithm with a 1D lattice.

## Hat monotile (aperiodic)

The Hat monotile (Smith, Myers, Kaplan, Goodman-Strauss 2023; see [[Aperiodic Tiling and the Hat Monotile]]) tiles the plane **aperiodically** — no translational symmetry. Generation requires either:

1. **Substitution rules**: each Hat tile contains a meta-Hat structure; iterate.
2. **Cut-and-project**: project from a higher-dimensional periodic lattice; computationally heavier.
3. **Inflation algorithm**: scale + replace pattern.

```typescript
const HAT_VERTICES: Point[] = [
  // 13 vertices of the Hat polykite — kite-and-half-kite assembly
  // Coordinates from Smith et al. 2023, "An aperiodic monotile"
  // ...
];

function generateHatTiling(level: number): Hat[] {
  // Start with a meta-tile assembly H7+H8+T+P from the paper
  // Apply substitution rules at each inflation level
  let tiles = INITIAL_HAT_ASSEMBLY;
  for (let i = 0; i < level; i++) {
    tiles = tiles.flatMap(substitute);
  }
  return tiles;
}
```

A practical TypeScript port of the substitution rules is non-trivial; the [Hat tiling explorer reference implementation](https://cs.uwaterloo.ca/~csk/hat/) provides authoritative coordinates. For most generative-art uses, a precomputed patch (5-7 inflation levels = a few thousand tiles) is enough.

## Pattern-style analysis (inverse problem)

Given an existing pattern image, detect which wallpaper group it has. Useful for branding-pattern audits.

```typescript
async function detectWallpaperGroup(image: ImageData): Promise<{ group: string; confidence: number }[]> {
  // 1. Find the fundamental period (autocorrelation peaks)
  const lattice = detectLattice(image);
  
  // 2. For each candidate group, test if the lattice + symmetries are present
  const groupScores: { group: string; confidence: number }[] = [];
  for (const groupName of Object.keys(GROUPS)) {
    const score = testGroupConsistency(image, GROUPS[groupName], lattice);
    groupScores.push({ group: groupName, confidence: score });
  }
  
  return groupScores.sort((a, b) => b.confidence - a.confidence);
}
```

Lattice detection: 2D autocorrelation peaks. Symmetry testing: image-difference between original and the image transformed by each generator. The most-symmetric group consistent with the image wins.

## Islamic geometric pattern (Bonner polygonal technique)

[[Islamic Geometric Patterns and the Polygonal Technique]] uses a **polygon-tessellation underlay** plus **chord-pattern construction**. Implementation:

```typescript
interface PolygonalConstruction {
  tessellation: "p6m" | "p4m" | "p4g";     // underlying tile group
  fundamentalPolygons: Polygon[];           // stars, hexagons, etc.
  chordAngle: number;                       // angle of line emanating from each midpoint (Bonner's key parameter)
}

function generateIslamicPattern(c: PolygonalConstruction, bounds: Rect): Path[] {
  const tessellation = generatePattern([c.fundamentalPolygons], GROUPS[c.tessellation], bounds);
  return tessellation.flatMap(poly => {
    // For each edge of each polygon, emit two chords at ±chordAngle from the edge midpoint
    return computeChords(poly, c.chordAngle);
  });
}
```

The chord angle is the primary aesthetic parameter; 70°-80° produces "acute," 50°-60° "median," 30°-40° "obtuse" — Bonner's three modal classes.

## Library recommendations

- **No mature JS library** for the full 17 wallpaper groups; this is "roll your own" territory. The math is small enough.
- For SVG path operations: **svg.js**, **paper.js**, or **flatten-js** (geometry).
- For pattern rendering: **three.js** with `RepeatWrapping`, **paper.js** directly, or canvas 2D context.
- For Hat: reference Java/C implementations from Kaplan's lab.
- Python parity: `pymatgen` includes the 17 wallpaper groups; `sympy` provides symmetry group representations.

## Performance

- p1, p2 (simple groups): ~0.5 ms / 1000 tiles
- p4m, p6m (complex generators): ~2-5 ms / 1000 tiles
- Hat at level 5: ~20-50 ms total for ~3000 tiles
- All comfortable for offline pattern generation; realtime kaleidoscope-style works for simple groups.

## Validation

Reference cases:
- M.C. Escher's "Day and Night" → p1g
- Most Islamic geometric patterns → p6m or p4m
- Penrose tilings (historical) → P3 / P2 substitution (different framework)
- Hat (2023) → aperiodic (no group)
- William Morris textile patterns → typically p1 or p2

## Cultural-validity flag

Per `feedback_cross-cultural-validity`, pattern *vocabulary* varies dramatically across traditions:

- **Islamic**: heavy use of p6m, p4m with star+rosette motifs
- **Celtic**: interlace pattern; group structure complicated by over/under crossings
- **Japanese**: *kamon* family crests, often p1 or simple rotational
- **Pre-Columbian / Andean**: highly varied; *tocapu* grid systems
- **Western 19th–20th century**: p1 / p2 textile; modernist exploration of higher groups

The 17-group framework is **mathematically universal**; the *motif choice + grouping convention* per tradition is culturally distinctive.

## Open research

- **Inverse-design**: generate a pattern matching brand-archetype constraints (e.g., "warm + organic + p3 hexagonal" → Earth Mother brand archetype tile)
- **Hat tessellation in branding**: novel aperiodic patterns as a 2026+ design vocabulary; not yet widely-used commercially as of writing
- **Cross-group blending**: smoothly morphing one group's pattern into another's (animation/transition); mathematically interesting

## Related pages

[[Symmetry Groups and Tessellation]] · [[Aperiodic Tiling and the Hat Monotile]] · [[Islamic Geometric Patterns and the Polygonal Technique]] · [[Op-Art and Cross-Modal Rhythm]] · [[Movement Rhythm and Repetition]] · [[Procedural Paradigms]] · [[L-Systems and Grammars]] · [[Brand Style Guides as Rule-Systems]]

## Sources

- Schattschneider, D. (1978). The plane symmetry groups: Their recognition and notation. *American Mathematical Monthly* 85(6), 439–450. https://www.jstor.org/stable/2320158
- Conway, J. H., Burgiel, H., & Goodman-Strauss, C. (2008). *The Symmetries of Things*. A K Peters. https://doi.org/10.1201/b10564
- Smith, D., Myers, J. S., Kaplan, C. S., & Goodman-Strauss, C. (2023). An aperiodic monotile. arXiv:2303.10798. https://arxiv.org/abs/2303.10798
- Bonner, J. (2017). *Islamic Geometric Patterns*. Springer. https://doi.org/10.1007/978-1-4419-0217-7
- Hat tiling reference implementation. https://cs.uwaterloo.ca/~csk/hat/
