import { mkdirSync, writeFileSync } from "node:fs";
import { generateIgp, defaultIgpParams } from "../generators/igp";
import { renderSvg } from "../renderers/svg";

mkdirSync("out", { recursive: true });
writeFileSync("out/sample.svg", renderSvg(generateIgp(defaultIgpParams())));
console.log("wrote out/sample.svg");
