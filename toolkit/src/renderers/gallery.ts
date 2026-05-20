import type { CompositionResult } from "../compose";

export interface GalleryEntry {
  label: string;
  description: string;
  svg: string;
  result: CompositionResult;
}

function pct(x: number): string {
  return `${Math.round(x * 100)}%`;
}

function barColor(score: number): string {
  // red (low) → amber → green (high)
  const hue = Math.round(score * 130); // 0=red, 130=green
  return `hsl(${hue} 70% 45%)`;
}

function card(e: GalleryEntry): string {
  const bars = e.result.perOperator
    .map(
      (p) => `
        <div class="op">
          <div class="op-head"><span>${p.name}</span><span>${pct(p.score)} · w${p.weight}</span></div>
          <div class="track"><div class="fill" style="width:${pct(p.score)};background:${barColor(p.score)}"></div></div>
        </div>`,
    )
    .join("");
  const fixes = e.result.fixes.length
    ? e.result.fixes
        .map((f) => `<li><b>${f.axis}</b> → ${f.direction}: ${f.detail}</li>`)
        .join("")
    : `<li class="ok">no fixes — all axes within target</li>`;
  return `
    <section class="card">
      <h2>${e.label}</h2>
      <p class="desc">${e.description}</p>
      <div class="art">${e.svg}</div>
      <div class="composite">composite <b>${pct(e.result.composite)}</b></div>
      ${bars}
      <ul class="fixes">${fixes}</ul>
    </section>`;
}

export function buildGalleryHtml(entries: GalleryEntry[]): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Operator-composition scorecards</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; background: #0c1118; color: #e7edf5; font: 14px/1.5 system-ui, sans-serif; }
  header { padding: 24px 28px 8px; }
  header h1 { margin: 0 0 4px; font-size: 20px; }
  header p { margin: 0; color: #93a4b8; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; padding: 18px 28px 40px; }
  .card { background: #131b26; border: 1px solid #1f2c3a; border-radius: 12px; padding: 14px; }
  .card h2 { margin: 0 0 2px; font-size: 15px; }
  .desc { margin: 0 0 10px; color: #8aa0b6; font-size: 12px; }
  .art { background: #0a1320; border-radius: 8px; overflow: hidden; aspect-ratio: 1; }
  .art svg { width: 100%; height: 100%; display: block; }
  .composite { margin: 12px 0 8px; font-size: 13px; color: #b9c7d6; }
  .composite b { font-size: 18px; color: #fff; }
  .op { margin: 6px 0; }
  .op-head { display: flex; justify-content: space-between; font-size: 12px; color: #aab9c9; }
  .track { height: 6px; background: #20303f; border-radius: 4px; overflow: hidden; margin-top: 2px; }
  .fill { height: 100%; }
  .fixes { margin: 10px 0 0; padding-left: 16px; font-size: 12px; color: #cdd9e6; }
  .fixes .ok { color: #5fbf7f; list-style: none; margin-left: -16px; }
</style>
</head>
<body>
<header>
  <h1>Operator-composition scorecards</h1>
  <p>One target pattern + four deliberate failures, each scored by the timurid-igp profile. The fix list is what the composer would tell a generator to change.</p>
</header>
<div class="grid">
${entries.map(card).join("\n")}
</div>
</body>
</html>`;
}
