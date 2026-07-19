# Emberveil Dark

**Status:** Core family theme, dark companion, prototype study 03  
**Family:** Emberveil  
**Preview:** [emberveil-dark.html](../previews/emberveil-dark.html)

## Purpose

Emberveil Dark is the dark member of the Emberveil family and the first concept to feel like a plausible long-term personal theme rather than an interesting experiment. It is designed for extended use across IDEs, terminals, personal applications, websites, and future products.

The theme assumes that dark interfaces should not be black. Instead, they should feel atmospheric, layered, and comfortable, using a warm-neutral Mirage-like canvas with carefully placed semantic light.

## Initial direction

Emberveil Dark was created after Aurora Forge proved too strongly associated with Cobalt2's blue workbench. The new direction made Ayu Mirage the center of gravity and reassigned the remaining influences to supporting roles:

- **Ayu Mirage is dominant:** atmosphere, syntax distribution, warmth, and rhythm.
- **Personal preferences are the signature:** orange control flow, meaningful green comments, a very dark current line, and restrained plain text.
- **Nord is structural support:** calm layering, softened cyan types, and disciplined secondary contrast.
- **JetBrains supplies grammar:** practical semantic differentiation and clear editor states.
- **Cobalt2 is only a trace:** a small amount of golden focus energy without blue-dominant chrome.

## Core character

Emberveil Dark is warmer and quieter than Aurora Forge. Its broad surfaces live in a narrow family of charcoal, plum-slate, and smoky navy values. Color appears as localized illumination rather than as large painted UI regions.

The experience can be summarized as:

> A muted Mirage atmosphere with warm semantic light, cool structural glass, and a personal orange pulse.

The theme should feel creative without being theatrical and distinctive without becoming exhausting.

## Color system

| Role | Color | Intent |
|---|---:|---|
| Editor canvas | `#242632` | Warm-neutral night surface; atmospheric but not visibly cobalt. |
| Shell | `#1D2029` | Deep outer chrome used sparingly. |
| Sidebar | `#20232D` | Quiet structural surface close to the editor. |
| Panel | `#292C38` | Gentle elevation without bright borders. |
| Raised surface | `#303342` | Completion lists, popovers, and focused controls. |
| Primary text | `#CCCAC2` | Warm gray inspired by paper rather than white light. |
| Keywords | `#FF9F5B` | Personal orange and the primary syntax signature. |
| Functions | `#FFD173` | Mirage amber for calls and declarations. |
| Types | `#73C7D6` | Soft Frost cyan for classes and structural types. |
| Strings | `#B8D982` | Lichen green that is bright but not fluorescent. |
| Numbers | `#C8ABE6` | Soft mauve for constants and numeric literals. |
| Properties | `#F29E74` | Coral for member-level semantics. |
| Standard comments | `#727D8E` | Muted slate for incidental commentary. |
| Meaningful documentation | `#9FCF86` | Green for documentation and comments worth noticing. |
| Focus | `#FFCC66` | Golden focus energy used for carets, active tabs, and narrow emphasis. |
| Current line | `#2D3040` | A darker focus band with minimal distraction. |

## Syntax language

Emberveil Dark separates syntax semantically while preserving a clear order of importance:

1. **Control flow** is orange and receives the strongest structural emphasis.
2. **Functions** are amber, producing the familiar Ayu Mirage rhythm of warm executable landmarks.
3. **Types** are cyan and serve as cool counterweights.
4. **Strings** are lichen green; **numbers** are mauve; **properties** are coral.
5. **Plain variables and punctuation** stay near the warm neutral foreground.
6. **Ordinary comments** are muted slate, while documentation or intentionally important comments may use green.

This two-level comment model is an important refinement. It preserves the creator's attraction to green comments without allowing every comment to dominate the page.

## Interface behavior

The interface should feel quiet and materially layered:

- Large surfaces differ through small changes in warmth and density, not strong hue shifts.
- Sidebars remain close to the editor color instead of becoming blue blocks.
- Active items receive a narrow orange indicator.
- Golden focus appears as a caret, tab underline, or thin status edge.
- Primary actions use warm orange.
- Completion lists and popovers are slightly raised and may use an amber or cyan semantic edge.
- Status bars remain neutral rather than becoming saturated brand banners.

## Family relationship

Emberveil Dark and Emberveil are not independent palettes with similar names. They are two material expressions of the same semantic system.

Their shared identity includes:

- Orange control flow.
- Amber functions.
- Cyan types.
- Green strings and meaningful documentation.
- Mauve numbers.
- Coral properties.
- Warm-neutral plain text.
- Narrow golden focus states.

The dark theme expresses these colors as light within atmosphere. The regular theme expresses them as ink on paper.

## What makes Emberveil Dark unique

Emberveil Dark is the first theme in the exploration to represent the creator's current taste rather than merely documenting past preferences. Ayu Mirage is clearly recognizable as the primary influence, but the theme is not a recolor or clone. Its personal identity comes from stronger orange control flow, the two-level comment model, non-blue application chrome, and the deliberate use of warm-neutral surfaces.

## Boundaries

The theme must not drift toward pure black, bright white text, or cobalt-dominant sidebars. It also should not turn every semantic category into a similarly saturated color. Warm colors should carry execution and decision; cool colors should carry structure.

## Future development

Emberveil Dark is intended to become a reusable cross-platform token system. Future work should include:

- Formal core, semantic, component, and syntax token files.
- VS Code and JetBrains implementations.
- Terminal, shell, and diff palettes.
- Application components covering forms, tables, dialogs, navigation, charts, and data states.
- Accessibility checks and prolonged real-world testing.
- Platform-specific adaptations that preserve semantic roles even when exact colors must change.
