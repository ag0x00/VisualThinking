import type { CompositionResult } from "../compose";

export interface GalleryEntry {
  label: string;
  description: string;
  svg: string;
  result: CompositionResult;
}

export interface GalleryGroup {
  title: string;
  entries: GalleryEntry[];
}

function pct(x: number): string {
  return `${Math.round(x * 100)}%`;
}

function barColor(score: number): string {
  // red (low) → amber → green (high)
  const hue = Math.round(score * 130); // 0=red, 130=green
  return `hsl(${hue} 70% 45%)`;
}

function bar(score: number, extraClass = ""): string {
  return `<div class="track ${extraClass}"><div class="fill" style="width:${pct(score)};background:${barColor(score)}"></div></div>`;
}

function opBlock(p: CompositionResult["perOperator"][number]): string {
  const subs = p.components?.length
    ? `<div class="subs">${p.components
        .map(
          (c) => `
          <div class="sub">
            <div class="sub-head"><span>${c.label}</span><span>${pct(c.score)} · w${c.weight}</span></div>
            ${bar(c.score, "sm")}
          </div>`,
        )
        .join("")}</div>`
    : `<div class="op-sub">measured ${p.measured.toFixed(2)} · target ${p.target}</div>`;
  return `
        <div class="op">
          <div class="op-head"><span>${p.name}</span><span>score ${pct(p.score)} · w${p.weight}</span></div>
          ${bar(p.score)}
          <div class="rule">${p.rule}</div>
          ${subs}
        </div>`;
}

function card(e: GalleryEntry): string {
  const ops = e.result.perOperator.map(opBlock).join("");
  const fixes = e.result.fixes.length
    ? e.result.fixes.map((f) => `<li><b>${f.axis}</b> → ${f.direction}: ${f.detail}</li>`).join("")
    : `<li class="ok">no fixes — all axes within target</li>`;
  return `
    <section class="card">
      <h2>${e.label}</h2>
      <p class="desc">${e.description}</p>
      <div class="art">${e.svg}</div>
      <div class="composite">composite <b>${pct(e.result.composite)}</b></div>
      ${ops}
      <ul class="fixes">${fixes}</ul>
    </section>`;
}

const LEGEND = `
  <details class="legend" open>
    <summary>What does the percentage mean?</summary>
    <p><b>Score = target-adherence</b> (100% = on target), <b>not</b> a measurement of "how much" of the property is present. Each metric converts its measurement to a score with a different rule:</p>
    <table>
      <thead><tr><th>Metric</th><th>Target shape</th><th>measured → score</th><th>Examples</th></tr></thead>
      <tbody>
        <tr><td>symmetry</td><td>floor (≥0.98)</td><td><code>measured ÷ 0.98</code>, capped — higher always better</td><td>1.00→100% · 0.49→50%</td></tr>
        <tr><td>complexity</td><td>band (0.55–0.78)</td><td>100% inside the band; outside, drops by <code>distance ÷ 0.25</code> — <b>too much also scores low</b></td><td>0.77→100% · 0.95→32% · 0.31→~0%</td></tr>
        <tr><td>colorChord</td><td>blend</td><td><code>0.6 × hue-on-arc + 0.4 × lightness-spread</code> (sub-bars below)</td><td>0% on-arc but full spread → 40%</td></tr>
      </tbody>
    </table>
    <p class="note">Percentages are comparable only as "closeness to <i>this</i> axis's target", not as like-for-like amounts. The composite is the weighted mean of the per-axis scores.</p>
  </details>`;

export function buildGalleryHtml(groups: GalleryGroup[]): string {
  const body = groups
    .map(
      (g) => `<h2 class="group">${g.title}</h2>
<div class="grid">
${g.entries.map(card).join("\n")}
</div>`,
    )
    .join("\n");
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
  .legend { margin: 8px 28px 0; background: #131b26; border: 1px solid #1f2c3a; border-radius: 10px; padding: 12px 16px; }
  .legend summary { cursor: pointer; font-weight: 600; }
  .legend p { color: #b9c7d6; }
  .legend .note { color: #8aa0b6; font-size: 12px; }
  .legend table { border-collapse: collapse; width: 100%; font-size: 12px; margin: 8px 0; }
  .legend th, .legend td { border: 1px solid #243444; padding: 6px 8px; text-align: left; vertical-align: top; }
  .legend th { color: #aab9c9; background: #0f1722; }
  .legend code { background: #0a1320; padding: 1px 4px; border-radius: 4px; }
  .group { margin: 18px 28px 0; font-size: 16px; color: #cfe0f0; border-bottom: 1px solid #1f2c3a; padding-bottom: 6px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; padding: 14px 28px 32px; }
  .card { background: #131b26; border: 1px solid #1f2c3a; border-radius: 12px; padding: 14px; }
  .card h2 { margin: 0 0 2px; font-size: 15px; }
  .desc { margin: 0 0 10px; color: #8aa0b6; font-size: 12px; }
  .art { background: #0a1320; border-radius: 8px; overflow: hidden; aspect-ratio: 1; }
  .art svg { width: 100%; height: 100%; display: block; }
  .composite { margin: 12px 0 8px; font-size: 13px; color: #b9c7d6; }
  .composite b { font-size: 18px; color: #fff; }
  .op { margin: 10px 0; }
  .op-head { display: flex; justify-content: space-between; font-size: 12px; color: #aab9c9; }
  .track { height: 6px; background: #20303f; border-radius: 4px; overflow: hidden; margin-top: 2px; }
  .track.sm { height: 4px; }
  .fill { height: 100%; }
  .rule { font-size: 11px; color: #6f8298; margin-top: 3px; font-style: italic; }
  .op-sub { font-size: 11px; color: #6f8298; margin-top: 3px; }
  .subs { margin-top: 6px; padding-left: 10px; border-left: 1px solid #243444; }
  .sub { margin: 4px 0; }
  .sub-head { display: flex; justify-content: space-between; font-size: 11px; color: #93a4b8; }
  .fixes { margin: 10px 0 0; padding-left: 16px; font-size: 12px; color: #cdd9e6; }
  .fixes .ok { color: #5fbf7f; list-style: none; margin-left: -16px; }
</style>
</head>
<body>
<header>
  <h1>Operator-composition scorecards</h1>
  <p>One target pattern + four deliberate failures, each scored by the timurid-igp profile. The fix list is what the composer would tell a generator to change.</p>
</header>
${LEGEND}
${body}
</body>
</html>`;
}
