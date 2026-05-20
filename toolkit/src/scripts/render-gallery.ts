import { mkdirSync, writeFileSync } from "node:fs";
import { compose } from "../compose";
import { renderSvg } from "../renderers/svg";
import { buildGalleryHtml, type GalleryEntry } from "../renderers/gallery";
import { timuridIgpProfile } from "../profiles/timurid-igp";
import { goodPlan, degradedVariants } from "../variants";

const good = goodPlan();
const entries: GalleryEntry[] = [
  { label: "GOOD (target)", description: "default 6-fold generator", svg: renderSvg(good), result: compose(good, timuridIgpProfile) },
  ...degradedVariants().map((v) => ({
    label: v.label,
    description: v.description,
    svg: renderSvg(v.plan),
    result: compose(v.plan, timuridIgpProfile),
  })),
];

mkdirSync("out", { recursive: true });
writeFileSync("out/gallery.html", buildGalleryHtml(entries));
console.log("wrote out/gallery.html");
