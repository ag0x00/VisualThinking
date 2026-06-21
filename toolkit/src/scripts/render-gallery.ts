import { mkdirSync, writeFileSync } from "node:fs";
import { compose } from "../compose";
import { renderSvg } from "../renderers/svg";
import { buildGalleryHtml, type GalleryEntry, type GalleryGroup } from "../renderers/gallery";
import type { AestheticProfile } from "../profile";
import { timuridIgpProfile } from "../profiles/timurid-igp";
import { timuridTilingProfile } from "../profiles/timurid-tiling";
import { goodPlan, degradedVariants, tilingGood, tilingVariants } from "../variants";
import { improve } from "../improve";
import type { TuningMap } from "../tuning";
import { igpTuning } from "../tuning/igp";
import { tilingTuning } from "../tuning/tiling";
import { generateIgp, defaultIgpParams } from "../generators/igp";
import { generateTiling, defaultTilingParams } from "../generators/tiling";
import { truchetProfile } from "../profiles/truchet";
import { truchetTuning } from "../tuning/truchet";
import { generateTruchet, defaultTruchetParams } from "../generators/truchet";
import { truchetGood, truchetVariants } from "../variants";
import { girih12Profile } from "../profiles/girih12";
import { girih12Tuning } from "../tuning/girih12";
import { generateGirih12, defaultGirih12Params } from "../generators/girih12";
import { girih12Good, girih12Variants } from "../variants";
import type { RenderPlan } from "../render-plan";

function entry(label: string, description: string, plan: RenderPlan, profile: AestheticProfile): GalleryEntry {
  return { label, description, svg: renderSvg(plan), result: compose(plan, profile) };
}

const pct = (x: number) => `${Math.round(x * 100)}%`;

// Build an "Improvement" group: start state + one card per accepted improve() step.
function improvementGroup<P>(
  title: string,
  generate: (p: P) => RenderPlan,
  start: P,
  profile: AestheticProfile,
  tuning: TuningMap,
): GalleryGroup {
  const r = improve(generate, start, profile, tuning, { targetComposite: 0.99 });
  const entries: GalleryEntry[] = [entry("start", "degraded params, below target", generate(start), profile)];
  for (const s of r.trajectory) {
    entries.push(
      entry(
        `step ${s.iter}: ${s.fix}`,
        `${s.param} ${s.from}→${s.to} · ${pct(s.compositeBefore)}→${pct(s.compositeAfter)}`,
        generate(s.params),
        profile,
      ),
    );
  }
  return { title, entries };
}

const strapwork: GalleryGroup = {
  title: "Strapwork (lines)",
  entries: [
    entry("GOOD (target)", "default 6-fold generator", goodPlan(), timuridIgpProfile),
    ...degradedVariants().map((v) => entry(v.label, v.description, v.plan, timuridIgpProfile)),
  ],
};

const tilework: GalleryGroup = {
  title: "Tilework (cells)",
  entries: [
    entry("GOOD (target)", "default 6-fold tiling", tilingGood(), timuridTilingProfile),
    ...tilingVariants().map((v) => entry(v.label, v.description, v.plan, timuridTilingProfile)),
  ],
};

const improveIgp = improvementGroup(
  "Improvement — strapwork (improve() closing the loop)",
  generateIgp,
  { ...defaultIgpParams(), rings: 3, segmentScale: 0.5 },
  timuridIgpProfile,
  igpTuning,
);

const improveTiling = improvementGroup(
  "Improvement — tilework (improve() closing the loop)",
  generateTiling,
  { ...defaultTilingParams(), cellScale: 0.9, channelJitter: 1.0 },
  timuridTilingProfile,
  tilingTuning,
);

const truchet: GalleryGroup = {
  title: "Truchet (wall-to-wall)",
  entries: [
    entry("GOOD (target)", "default 8×8 periodic grid", truchetGood(), truchetProfile),
    ...truchetVariants().map((x) => entry(x.label, x.description, x.plan, truchetProfile)),
  ],
};

const improveTruchet = improvementGroup(
  "Improvement — truchet (improve() on a new medium)",
  generateTruchet,
  { ...defaultTruchetParams(), latticeJitter: 0.2, cellScale: 0.85 },
  truchetProfile,
  truchetTuning,
);

const girih12: GalleryGroup = {
  title: "Girih 12-fold (glazed mosaic)",
  entries: [
    entry("GOOD (target)", "12-fold star-and-rosette, Samarkand 7-colour, symmetric accents", girih12Good(), girih12Profile),
    ...girih12Variants().map((x) => entry(x.label, x.description, x.plan, girih12Profile)),
  ],
};

const improveGirih12 = improvementGroup(
  "Improvement — girih12 (improve() on a real art medium)",
  generateGirih12,
  { ...defaultGirih12Params(), latticeJitter: 0.15, groutGap: 0.25 },
  girih12Profile,
  girih12Tuning,
);

mkdirSync("out", { recursive: true });
writeFileSync("out/gallery.html", buildGalleryHtml([improveGirih12, girih12, improveTruchet, truchet, improveIgp, improveTiling, tilework, strapwork]));
console.log("wrote out/gallery.html");
