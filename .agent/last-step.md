# Last step — Emberveil logo prototypes

**Date:** 2026-08-31
**Branch:** main (nothing committed; all work is untracked in `assets/logo-prototypes/`)

## Where things stand

Round 3 of logo exploration. Mario is judging marks in the browser and culling between rounds.

- **Round 1** (6 marks): kept Emberrise, Veiled Sun. Discarded Ember Cup, Molten Horizon, Veil Cradle, Sun Strata.
- **Round 2** (+6 passes pushing lava/ember): additionally kept Emberrise/Bloom, Veiled Sun/Drift. Discarded Molten, Crust, Core, Fracture.
- **Round 3** (current, 10 marks): the 4 survivors plus 3 new passes per family, built on the survivors rather than the baselines.

**Selected:** Emberrise / Bloom Lake. Promoted into the canonical assets.

## Done

On branch `logo-emberrise-bloom-lake` (two commits, not merged to main):

1. `add:` the whole prototype exploration under `assets/logo-prototypes/`. Mario asked for
   all round-3 results to stay in repo history, so nothing was pruned at commit time.
2. `update:` `assets/icon.svg` and `assets/icon-app.svg` to Bloom Lake. Adapted per role —
   `icon.svg` drops the bloom (a halo cannot resolve against its transparent ground),
   `icon-app.svg` keeps it and scales the mark 0.82 to sit inside the tile rim. Both moved
   onto the spec surface and rim tokens, which the old app icon predated.

`main` has not been touched; fast-forward with `git checkout main && git merge --ff-only logo-emberrise-bloom-lake`.

## Not done

`assets/combined.png`, `dark.png` and `light.png` are theme screenshots, not icons, and were
left alone. Nothing else in the repo was checked for references to the old mark.

## Key files

- `assets/logo-prototypes/build.mjs` — single source of geometry. Emits all standalone SVGs and `index.html`. Edit here, then `node assets/logo-prototypes/build.mjs`.
- `assets/logo-prototypes/index.html` — judging page: each mark on both Emberveil surfaces, 88px hero, ramp to 16px, app tile.
- `assets/logo-prototypes/emberveil-*.svg` — standalone marks, self-theming via `prefers-color-scheme` like `assets/icon.svg`.

## Constraints being held

- All colors come from `emberveil/specs/emberveil.md` and `emberveil-dark.md`. No ad-hoc palette values.
- Ember ramp dark `#BC531E → #FF9F5B → #FFD173`; light `#914321 → #A44012 → #A86B00`. Veil `#73C7D6` / `#1C6570`.
- Gradient stops use `style="stop-color: var(--x)"` rather than the presentation attribute, for reliable var() substitution.

## Verification gap — read before trusting anything visual

This machine has **no working SVG renderer for verification**: no Chrome, no librsvg (ImageMagick falls back to its internal MSVG coder, which renders neither gradients nor strokes), Vivaldi's headless mode is stripped, GIMP batch hangs, and the `mcp__t3-code__preview_*` tools error with "Preview automation open failed".

Workaround in use: `/tmp/flat.mjs` flattens the standalone SVGs (substitutes palette hex for `var()`, expands stroked polylines into exact filled polygons, drops soft blooms, collapses gradient fills to flat ember) into `/tmp/sheet.svg`, rasterized with `magick -density 340`. This verifies **composition, containment and overlap only**.

**Never verified in a real browser:** every gradient, the bloom halos, and the light-mode variable block. If a mark looks wrong to Mario, that is where to look first.
