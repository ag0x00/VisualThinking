export const ADJACENT_CONSIDERATIONS: Array<{ pattern: RegExp; messages: string[] }> = [
  {
    pattern: /\b(interactive|reactive|mouse|hover|touch|click)\b/i,
    messages: [
      "Cross-modal binding window: input-to-render latency above ~70 ms breaks the causal feel (Michotte threshold).",
      "Treat mouse-X / mouse-Y / scroll / hover-time as parameter sources to the renderer — same mapping primitives as audio-driven visualizers.",
    ],
  },
  {
    pattern: /\b(music|audio|beat|sound|spectral)\b/i,
    messages: [
      "Use AudioWorklet (not deprecated ScriptProcessorNode) to stay inside the 70 ms cross-modal binding window.",
      "Major/minor → warm/cool palette mapping is Western-specific. Universal: pitch height, loudness, tempo.",
    ],
  },
  {
    pattern: /\b(wallpaper|pattern|tessellation|symmetry)\b/i,
    messages: [
      "The Hat monotile (2023) is the named successor to Penrose for aperiodic tilings; gives visual variety without symmetry-cliché.",
      "17 wallpaper groups are mathematically universal; motif vocabulary per tradition is culturally distinctive.",
    ],
  },
  {
    pattern: /\b(figurative|portrait|character|pose|figure)\b/i,
    messages: [
      "Pose + face channels are dissociable; specify and verify separately. Observers trust whichever channel is more vivid when they conflict.",
      "Contrapposto (weight-shift pose) reads as alive-but-stable; frontal-symmetric reads as ceremonial or wooden.",
    ],
  },
  {
    pattern: /\b(brand|branding|logo|identity)\b/i,
    messages: [
      "For global brand work, avoid culturally-inverted emblems (thumbs-up, OK-sign, V-back-of-hand, etc.). Run a cultural-emblem audit before publishing.",
      "Brand archetype pose vocabularies (Mark & Pearson 2001) are culturally located; a 'Hero' Western expansive pose may read as arrogance in East-Asian markets.",
    ],
  },
];

export function adjacentFor(intent: string): string[] {
  const out: string[] = [];
  for (const { pattern, messages } of ADJACENT_CONSIDERATIONS) {
    if (pattern.test(intent)) out.push(...messages);
  }
  return Array.from(new Set(out));
}
