import { describe, it, expect } from "vitest";
import { periodicityOperator } from "../../src/operators/periodicity";
import type { Element, Oklch, RenderPlan, Vec2 } from "../../src/render-plan";

const PAL: Oklch[] = [{ l: 0.5, c: 0.1, h: 200 }];
const sq = (ox: number, oy: number): Vec2[] => [[ox, oy], [ox + 100, oy], [ox + 100, oy + 100], [ox, oy + 100]];
function plan(tiles: Vec2[][], lattice?: [Vec2, Vec2], extra: Element[] = []): RenderPlan {
  const els: Element[] = tiles.map((points) => ({ kind: "polygon", role: "tile", points }));
  return { bounds: { width: 200, height: 100 }, symmetry: { group: "p4", lattice }, palette: PAL, elements: [...els, ...extra] };
}

describe("periodicity", () => {
  it("scores a clean lattice 1.0", () => {
    expect(periodicityOperator.measure(plan([sq(0, 0), sq(100, 0)], [[100, 0], [0, 100]])).value).toBe(1);
  });

  it("drops below 1 and asks to increase when a cell is off-lattice", () => {
    const m = periodicityOperator.measure(plan([sq(0, 0), sq(150, 0)], [[100, 0], [0, 100]]));
    expect(m.value).toBeLessThan(1);
    const s = periodicityOperator.scoreAgainst(m, { minFidelity: 0.95 });
    expect(s.fix.axis).toBe("periodicity");
    expect(s.fix.direction).toBe("increase");
  });

  it("returns 1.0 when no lattice is declared", () => {
    expect(periodicityOperator.measure(plan([sq(0, 0)], undefined)).value).toBe(1);
  });

  it("ignores arc rotation (matches on tile frames only)", () => {
    const base = plan([sq(0, 0), sq(100, 0)], [[100, 0], [0, 100]]);
    const withArc = plan([sq(0, 0), sq(100, 0)], [[100, 0], [0, 100]], [{ kind: "path", role: "line", points: [[0, 0], [50, 50]] }]);
    expect(periodicityOperator.measure(withArc).value).toBe(periodicityOperator.measure(base).value);
  });
});
