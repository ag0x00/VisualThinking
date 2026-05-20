import { mkdirSync, writeFileSync } from "node:fs";
import { compose } from "../compose";
import { renderSvg } from "../renderers/svg";
import { buildGalleryHtml, type GalleryEntry, type GalleryGroup } from "../renderers/gallery";
import type { AestheticProfile } from "../profile";
import { timuridIgpProfile } from "../profiles/timurid-igp";
import { timuridTilingProfile } from "../profiles/timurid-tiling";
import { goodPlan, degradedVariants, tilingGood, tilingVariants } from "../variants";
import type { RenderPlan } from "../render-plan";

function entry(label: string, description: string, plan: RenderPlan, profile: AestheticProfile): GalleryEntry {
  return { label, description, svg: renderSvg(plan), result: compose(plan, profile) };
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

mkdirSync("out", { recursive: true });
writeFileSync("out/gallery.html", buildGalleryHtml([tilework, strapwork]));
console.log("wrote out/gallery.html");
