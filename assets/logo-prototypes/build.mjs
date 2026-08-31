#!/usr/bin/env node
// Generates the Emberveil logo prototypes and the side-by-side judging page.
// Geometry lives here once; standalone SVGs and index.html are both emitted from it.
//
// Round 2: Emberrise and Veiled Sun survived the first pass. Everything below is
// either one of those two unchanged, or a variation that pushes the molten side
// further — radial heat, full-strength lava, crust fractured by the veil.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = dirname(fileURLToPath(import.meta.url));

// Every value below comes from emberveil/specs/*.md. No ad-hoc palette entries.
const MODES = {
  dark: {
    label: 'Emberveil Dark',
    surface: '#242632',
    shell: '#1D2029',
    panel: '#292C38',
    raised: '#303342',
    rim: '#303342',
    text: '#CCCAC2',
    muted: '#727D8E',
    vars: {
      'ember-deep': '#BC531E',
      'ember': '#FF9F5B',
      'ember-core': '#FFD173',
      'focus': '#FFCC66',
      'veil': '#73C7D6',
    },
  },
  light: {
    label: 'Emberveil',
    surface: '#E4DED2',
    shell: '#CEC6BA',
    panel: '#DDD6CA',
    raised: '#EEE7DB',
    rim: '#CEC6BA',
    text: '#35383F',
    muted: '#58616B',
    vars: {
      'ember-deep': '#914321',
      'ember': '#A44012',
      'ember-core': '#A86B00',
      'focus': '#A86B00',
      'veil': '#1C6570',
    },
  },
};

/** Vertical molten ramp: crusted deep at the top, glowing core at the bottom. */
const molten = (id, y1, y2) => `
    <linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="32" y1="${y1}" x2="32" y2="${y2}">
      <stop offset="0" style="stop-color: var(--ember-deep)"/>
      <stop offset="0.52" style="stop-color: var(--ember)"/>
      <stop offset="1" style="stop-color: var(--ember-core)"/>
    </linearGradient>`;

/** Heat radiating out of a hot spot: white-gold core cooling to crust at the rim. */
const hotspot = (id, cx, cy, r, mid = 0.42) => `
    <radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">
      <stop offset="0" style="stop-color: var(--ember-core)"/>
      <stop offset="${mid}" style="stop-color: var(--ember)"/>
      <stop offset="1" style="stop-color: var(--ember-deep)"/>
    </radialGradient>`;

/** Soft ember bloom that fades to nothing, for glow behind a solid shape. */
const bloom = (id, cx, cy, r) => `
    <radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">
      <stop offset="0" style="stop-color: var(--ember); stop-opacity: 0.55"/>
      <stop offset="0.5" style="stop-color: var(--ember); stop-opacity: 0.2"/>
      <stop offset="1" style="stop-color: var(--ember); stop-opacity: 0"/>
    </radialGradient>`;

const PROTOTYPES = [
  {
    id: 'emberrise',
    family: 'Emberrise',
    name: 'Emberrise',
    kept: true,
    tagline: 'Round one, unchanged. Half sun breaking a horizon, its glow fading beneath.',
    desc: 'A rising sun above a horizon line, its light pooling in bands below.',
    render: (s) => `
  <defs>${molten(`g-${s}`, 16, 34)}</defs>
  <path d="M14 34 A18 18 0 0 1 50 34 Z" fill="url(#g-${s})"/>
  <rect x="6" y="34" width="52" height="4.5" rx="2.25" fill="var(--veil)"/>
  <rect x="15" y="43" width="34" height="4" rx="2" fill="var(--ember)" opacity="0.5"/>
  <rect x="24" y="50.5" width="16" height="3.5" rx="1.75" fill="var(--ember)" opacity="0.28"/>`,
  },
  {
    id: 'emberrise-bloom',
    family: 'Emberrise',
    name: 'Emberrise / Bloom',
    tagline:
      'Radial heat instead of a flat ramp. The disc is hottest where it meets the horizon and an ember bloom bleeds past its edge into the surface.',
    desc: 'A rising sun with a radiant core and an ember glow bleeding into the surface.',
    render: (s) => `
  <defs>
${bloom(`b-${s}`, 32, 35, 28)}
${hotspot(`r-${s}`, 32, 34, 20, 0.5)}
  </defs>
  <circle cx="32" cy="35" r="28" fill="url(#b-${s})"/>
  <path d="M14 34 A18 18 0 0 1 50 34 Z" fill="url(#r-${s})"/>
  <rect x="6" y="34" width="52" height="4.5" rx="2.25" fill="var(--veil)"/>
  <rect x="14" y="43" width="36" height="4.5" rx="2.25" fill="var(--ember)" opacity="0.55"/>
  <rect x="23" y="51" width="18" height="4" rx="2" fill="var(--ember)" opacity="0.3"/>`,
  },
  {
    id: 'veiled-sun',
    family: 'Veiled Sun',
    name: 'Veiled Sun',
    kept: true,
    tagline: 'Round one, unchanged. A molten disc read through three cool strata.',
    desc: 'A molten sun disc crossed by three cool structural bands.',
    render: (s) => `
  <defs>${molten(`g-${s}`, 10, 54)}</defs>
  <circle cx="32" cy="32" r="22" fill="url(#g-${s})"/>
  <rect x="4" y="27.5" width="56" height="3.5" rx="1.75" fill="var(--veil)"/>
  <rect x="4" y="36.5" width="56" height="4.5" rx="2.25" fill="var(--veil)"/>
  <rect x="4" y="46" width="56" height="5.5" rx="2.75" fill="var(--veil)"/>`,
  },
  {
    id: 'veiled-sun-drift',
    family: 'Veiled Sun',
    name: 'Veiled Sun / Drift',
    tagline:
      'The strata break apart. Each band is two plates with a gap between them, and the lava shows through where the crust has pulled open.',
    desc: 'A lava disc crossed by broken crust plates with molten gaps between them.',
    render: (s) => `
  <defs>${hotspot(`r-${s}`, 32, 44, 34)}</defs>
  <circle cx="32" cy="32" r="22" fill="url(#r-${s})"/>
  <g fill="var(--veil)">
    <rect x="4" y="27.5" width="21" height="3.5" rx="1.75"/>
    <rect x="31" y="27.5" width="29" height="3.5" rx="1.75"/>
    <rect x="4" y="36.5" width="13" height="4.5" rx="2.25"/>
    <rect x="23" y="36.5" width="37" height="4.5" rx="2.25"/>
    <rect x="8" y="46" width="29" height="5.5" rx="2.75"/>
    <rect x="43" y="46" width="17" height="5.5" rx="2.75"/>
  </g>`,
  },
  {
    id: 'emberrise-bloom-drift',
    family: 'Emberrise',
    name: 'Emberrise / Bloom Drift',
    tagline:
      'Bloom kept, horizon broken. The crust pulls open just off centre and a molten column runs down through the gap.',
    desc: 'A glowing sun above a broken horizon, lava running down through the gap.',
    render: (s) => `
  <defs>
${bloom(`b-${s}`, 32, 35, 28)}
${hotspot(`r-${s}`, 32, 34, 20, 0.5)}
${hotspot(`c-${s}`, 31, 33, 22, 0.5)}
  </defs>
  <circle cx="32" cy="35" r="28" fill="url(#b-${s})"/>
  <path d="M14 34 A18 18 0 0 1 50 34 Z" fill="url(#r-${s})"/>
  <rect x="28.5" y="32" width="5" height="17" rx="2.5" fill="url(#c-${s})"/>
  <rect x="6" y="34" width="21" height="4.5" rx="2.25" fill="var(--veil)"/>
  <rect x="34.5" y="34" width="23.5" height="4.5" rx="2.25" fill="var(--veil)"/>
  <rect x="22" y="52" width="20" height="4" rx="2" fill="var(--ember)" opacity="0.4"/>`,
  },
  {
    id: 'emberrise-bloom-deep',
    family: 'Emberrise',
    name: 'Emberrise / Deep Bloom',
    tagline:
      'The bloom takes over. A small, very hot sun, a wide halo, one clean horizon — an ember glowing in the dark rather than a sunrise scene.',
    desc: 'A small intense ember sun with a wide halo above a single horizon line.',
    render: (s) => `
  <defs>
${bloom(`b-${s}`, 32, 34, 28)}
${hotspot(`r-${s}`, 32, 34, 14, 0.45)}
  </defs>
  <circle cx="32" cy="34" r="28" fill="url(#b-${s})"/>
  <path d="M19 34 A13 13 0 0 1 45 34 Z" fill="url(#r-${s})"/>
  <rect x="8" y="34" width="48" height="4" rx="2" fill="var(--veil)"/>
  <rect x="22" y="44" width="20" height="3.5" rx="1.75" fill="var(--ember)" opacity="0.35"/>`,
  },
  {
    id: 'emberrise-bloom-lake',
    family: 'Emberrise',
    name: 'Emberrise / Bloom Lake',
    tagline:
      'Bloom over the whole scene, and the reflection promoted to a lava lake at full strength with its own hot centre.',
    desc: 'A glowing sun above a lava lake, both radiating heat past the horizon.',
    render: (s) => `
  <defs>
${bloom(`b-${s}`, 32, 36, 28)}
${hotspot(`r-${s}`, 32, 34, 20, 0.5)}
${hotspot(`p-${s}`, 32, 45, 22, 0.45)}
  </defs>
  <g transform="translate(0 -2)">
    <circle cx="32" cy="36" r="28" fill="url(#b-${s})"/>
    <path d="M14 34 A18 18 0 0 1 50 34 Z" fill="url(#r-${s})"/>
    <rect x="6" y="34" width="52" height="4.5" rx="2.25" fill="var(--veil)"/>
    <rect x="13" y="42.5" width="38" height="5.5" rx="2.75" fill="url(#p-${s})"/>
    <rect x="20.5" y="51.5" width="23" height="5" rx="2.5" fill="url(#p-${s})"/>
  </g>`,
  },
  {
    id: 'veiled-sun-drift-bloom',
    family: 'Veiled Sun',
    name: 'Veiled Sun / Drift Bloom',
    tagline:
      'Drift plates with the heat bleeding past the disc edge, so the lava lights the surface it sits on.',
    desc: 'A lava disc behind broken crust plates, glowing past its own edge.',
    render: (s) => `
  <defs>
${bloom(`b-${s}`, 32, 33, 29)}
${hotspot(`r-${s}`, 32, 44, 34)}
  </defs>
  <circle cx="32" cy="33" r="29" fill="url(#b-${s})"/>
  <circle cx="32" cy="32" r="22" fill="url(#r-${s})"/>
  <g fill="var(--veil)">
    <rect x="4" y="27.5" width="21" height="3.5" rx="1.75"/>
    <rect x="31" y="27.5" width="29" height="3.5" rx="1.75"/>
    <rect x="4" y="36.5" width="13" height="4.5" rx="2.25"/>
    <rect x="23" y="36.5" width="37" height="4.5" rx="2.25"/>
    <rect x="8" y="46" width="29" height="5.5" rx="2.75"/>
    <rect x="43" y="46" width="17" height="5.5" rx="2.75"/>
  </g>`,
  },
  {
    id: 'veiled-sun-seam',
    family: 'Veiled Sun',
    name: 'Veiled Sun / Seam',
    tagline:
      'The gaps stop being random. Each plate break steps to the right so the openings line up into one molten seam running down through the crust.',
    desc: 'A lava disc under crust plates whose gaps align into a diagonal molten seam.',
    render: (s) => `
  <defs>${hotspot(`r-${s}`, 30, 40, 32)}</defs>
  <circle cx="32" cy="32" r="22" fill="url(#r-${s})"/>
  <g fill="var(--veil)">
    <rect x="4" y="27.5" width="15" height="3.5" rx="1.75"/>
    <rect x="25" y="27.5" width="35" height="3.5" rx="1.75"/>
    <rect x="4" y="36.5" width="23" height="4.5" rx="2.25"/>
    <rect x="33" y="36.5" width="27" height="4.5" rx="2.25"/>
    <rect x="6" y="46" width="29" height="5.5" rx="2.75"/>
    <rect x="41" y="46" width="19" height="5.5" rx="2.75"/>
  </g>`,
  },
  {
    id: 'veiled-sun-crust',
    family: 'Veiled Sun',
    name: 'Veiled Sun / Crust',
    tagline:
      'Drift pushed to its limit. Four courses of thick plates cover most of the disc, and the lava is only what escapes between them.',
    desc: 'A lava body almost fully covered by thick crust plates, light escaping between them.',
    render: (s) => `
  <defs>${hotspot(`r-${s}`, 32, 40, 30)}</defs>
  <circle cx="32" cy="32" r="22" fill="url(#r-${s})"/>
  <g fill="var(--veil)">
    <rect x="4" y="17" width="24" height="5" rx="2.5"/>
    <rect x="32" y="17" width="28" height="5" rx="2.5"/>
    <rect x="4" y="27" width="34" height="6" rx="3"/>
    <rect x="42" y="27" width="18" height="6" rx="3"/>
    <rect x="4" y="38.5" width="18" height="6.5" rx="3.25"/>
    <rect x="26" y="38.5" width="34" height="6.5" rx="3.25"/>
    <rect x="10" y="50" width="26" height="5" rx="2.5"/>
    <rect x="40" y="50" width="14" height="5" rx="2.5"/>
  </g>`,
  },
];

const FAMILY_NOTES = {
  Emberrise: 'A sun crossing a horizon. Round three keeps the flat baseline and the radial bloom, then pushes the bloom three ways: through a broken horizon, out into a wide halo, and down onto a lava lake.',
  'Veiled Sun': 'A disc read through the veil. Round three keeps the ruled strata and the drifting plates, then varies how much crust there is and where it breaks.',
};

const varBlock = (vars, indent) =>
  Object.entries(vars)
    .map(([k, v]) => `${indent}--${k}: ${v};`)
    .join('\n');

/** Standalone file: self-theming via prefers-color-scheme, matching assets/icon.svg. */
const standalone = (p) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="title desc">
  <title id="title">Emberveil — ${p.name}</title>
  <desc id="desc">${p.desc}</desc>
  <style>
    :root {
${varBlock(MODES.dark.vars, '      ')}
    }
    @media (prefers-color-scheme: light) {
      :root {
${varBlock(MODES.light.vars, '        ')}
      }
    }
  </style>
${p.render(p.id).trim().replace(/^/gm, '  ')}
</svg>
`;

const inline = (p, mode, size, extra = '') => {
  const suffix = `${p.id}-${mode}-${size}${extra}`;
  return `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">${p.render(suffix)}
</svg>`;
};

const RAMP = [40, 28, 20, 16];

const panel = (p, mode) => `
        <div class="panel mode-${mode}">
          <div class="panel-head">${MODES[mode].label}</div>
          <div class="hero">${inline(p, mode, 88)}</div>
          <div class="ramp">
            ${RAMP.map((n) => `<div class="ramp-item"><span class="ramp-size">${n}</span>${inline(p, mode, n)}</div>`).join('\n            ')}
          </div>
          <div class="tile">${inline(p, mode, 44, '-tile')}</div>
        </div>`;

const card = (p, i) => `
      <section class="card" id="${p.id}">
        <header class="card-head">
          <span class="index">${String(i + 1).padStart(2, '0')}</span>
          <h3>${p.name}</h3>
          ${p.kept ? '<span class="badge">kept</span>' : ''}
          <p>${p.tagline}</p>
          <code>emberveil-${p.id}.svg</code>
        </header>
        <div class="panels">
${panel(p, 'dark')}
${panel(p, 'light')}
        </div>
      </section>`;

const families = [...new Set(PROTOTYPES.map((p) => p.family))];
let n = 0;
const body = families
  .map(
    (f) => `    <h2 class="family">${f}</h2>
    <p class="family-note">${FAMILY_NOTES[f]}</p>
${PROTOTYPES.filter((p) => p.family === f)
  .map((p) => card(p, n++))
  .join('\n')}`
  )
  .join('\n');

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Emberveil — logo prototypes, round 3</title>
<style>
  :root {
    color-scheme: dark light;
    --page: ${MODES.dark.shell};
    --page-text: ${MODES.dark.text};
    --page-muted: ${MODES.dark.muted};
    --page-card: ${MODES.dark.panel};
    --page-rim: ${MODES.dark.rim};
    --page-accent: ${MODES.dark.vars.focus};
    --ui: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  }
  @media (prefers-color-scheme: light) {
    :root {
      --page: ${MODES.light.shell};
      --page-text: ${MODES.light.text};
      --page-muted: ${MODES.light.muted};
      --page-card: ${MODES.light.panel};
      --page-rim: ${MODES.light.rim};
      --page-accent: ${MODES.light.vars.focus};
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 40px 24px 72px;
    background: var(--page);
    color: var(--page-text);
    font-family: var(--ui);
    line-height: 1.5;
  }
  .wrap { max-width: 980px; margin: 0 auto; }
  h1 { font-size: 22px; margin: 0 0 6px; letter-spacing: -0.01em; }
  .lede { margin: 0 0 32px; color: var(--page-muted); max-width: 62ch; }
  .family {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 36px 0 4px;
    color: var(--page-accent);
  }
  .family-note { margin: 0 0 16px; color: var(--page-muted); max-width: 68ch; font-size: 14px; }
  .card {
    background: var(--page-card);
    border: 1px solid var(--page-rim);
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .card-head { margin-bottom: 16px; }
  .card-head h3 { display: inline; font-size: 17px; margin: 0; }
  .index {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--page-accent);
    margin-right: 8px;
  }
  .badge {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border: 1px solid var(--page-accent);
    color: var(--page-accent);
    border-radius: 5px;
    padding: 1px 5px;
    margin-left: 8px;
    vertical-align: 2px;
  }
  .card-head p { margin: 6px 0 8px; color: var(--page-muted); max-width: 68ch; }
  .card-head code {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--page-muted);
    background: color-mix(in srgb, var(--page) 60%, transparent);
    border-radius: 5px;
    padding: 2px 6px;
  }
  .panels { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .panel {
    border-radius: 9px;
    padding: 16px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 18px;
    grid-template-areas: "head head head" "hero ramp tile";
  }
  .panel-head {
    grid-area: head;
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.6;
  }
  .hero { grid-area: hero; display: flex; }
  .ramp { grid-area: ramp; display: flex; align-items: flex-end; gap: 12px; }
  .ramp-item { display: grid; justify-items: center; gap: 4px; }
  .ramp-size { font-family: var(--mono); font-size: 9px; opacity: 0.45; }
  .tile {
    grid-area: tile;
    width: 64px; height: 64px;
    display: grid; place-items: center;
    border-radius: 14px;
  }
  .mark { display: block; }
${Object.entries(MODES)
  .map(
    ([name, m]) => `  .mode-${name} {
    background: ${m.surface};
    color: ${m.text};
${varBlock(m.vars, '    ')}
  }
  .mode-${name} .tile { background: ${m.shell}; box-shadow: inset 0 0 0 1px ${m.rim}; }`
  )
  .join('\n')}
  @media (max-width: 720px) {
    .panels { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
  <div class="wrap">
    <h1>Emberveil — logo prototypes, round 3</h1>
    <p class="lede">Four marks carried through: the Emberrise and Veiled Sun baselines, plus Bloom and Drift.
      Each family gets three further passes built on the survivor rather than on the baseline. Every mark is shown on both Emberveil surfaces at 88px, down a size ramp to 16px,
      and on a rounded app tile.</p>
${body}
  </div>
</body>
</html>
`;

for (const p of PROTOTYPES) {
  writeFileSync(join(outDir, `emberveil-${p.id}.svg`), standalone(p));
}
writeFileSync(join(outDir, 'index.html'), page);
console.log(`Wrote ${PROTOTYPES.length} prototypes + index.html to ${outDir}`);
