# Emberveil

**Status:** Core family theme, regular paper-light mode, prototype study 04  
**Family:** Emberveil  
**Dark companion:** Emberveil Dark  
**Preview:** [emberveil.html](../previews/emberveil.html)

## Purpose

Emberveil is the regular, paper-light member of the Emberveil family. It exists so the theme system can serve applications and users who prefer brighter interfaces without resorting to blinding white surfaces or a mechanical inversion of dark mode.

The design started from a strict requirement: no large surface may use pure or near-pure white. Backgrounds should feel like physical material - dim paper, parchment, pressed fiber, or warm stone. Readability comes from dark ink, not from maximum screen luminance.

## Initial direction

The goal was to translate Emberveil Dark into a coherent light environment while preserving semantic identity. The solution was a material conversion rather than a numerical inversion:

- Dark atmospheric surfaces become warm paper surfaces.
- Luminous syntax colors become darker ink colors.
- Semantic roles remain unchanged.
- Elevation is expressed through warmth and density rather than brightness.
- Golden focus becomes ochre.
- Large-area contrast remains muted, while text contrast stays strong enough for sustained reading.

This approach produced the first light theme in the exploration that the creator felt could plausibly be used for more than a short period.

## Core character

Emberveil is tactile, calm, and editorial. It should resemble a well-made notebook or printed technical reference more than a glowing white application window. The interface is unmistakably light, but it avoids the visual shock associated with white canvases.

The experience can be summarized as:

> Warm paper surfaces carrying disciplined semantic ink, with burnt orange structure and quiet material depth.

## Color system

| Role | Color | Intent |
|---|---:|---|
| Editor canvas | `#E4DED2` | Dim paper; the dominant large-area surface. |
| Shell | `#CEC6BA` | Denser paper used for outer chrome. |
| Sidebar | `#D8D1C5` | Pressed-fiber surface clearly distinct from the editor without becoming dark. |
| Panel | `#DDD6CA` | Gentle elevation for tabs and status areas. |
| Raised surface | `#EEE7DB` | The lightest permitted paper, reserved for popovers and completion lists. |
| Primary text | `#35383F` | Charcoal ink with a slight cool bias. |
| Keywords | `#A44012` | Burnt orange ink preserving the family's control-flow signature. |
| Functions | `#875900` | Amber-brown ink for function calls and declarations. |
| Types | `#1C6570` | Deep teal ink derived from Emberveil Dark's Frost cyan. |
| Strings | `#46661F` | Olive ink derived from the dark theme's lichen green. |
| Numbers | `#704C87` | Mauve ink for numeric values and constants. |
| Properties | `#914321` | Rust-coral ink for members and attributes. |
| Standard comments | `#58616B` | Cool graphite annotation. |
| Meaningful documentation | `#45653A` | Green ink for documentation worth noticing. |
| Focus | `#A86B00` | Ochre for carets, active tabs, and narrow focus marks. |
| Current line | `#D6CFC3` | A denser paper band rather than a bright highlight. |
| Selection | `#C4D3D8` | A restrained cool wash that preserves syntax readability. |

## Syntax language

The semantic order mirrors Emberveil Dark:

1. **Keywords and control flow** use burnt orange.
2. **Functions** use amber ink.
3. **Types and classes** use deep teal.
4. **Strings** use olive; **numbers** use mauve; **properties** use rust-coral.
5. **Plain code** uses charcoal ink.
6. **Ordinary comments** use graphite, while documentation and meaningful annotations use green.

These colors are intentionally darker than their dark-mode counterparts. They should read as pigments deposited on paper, not colored light projected from a screen.

## Interface behavior

The UI follows five conversion rules:

### 1. Surface rule

No broad surface is white. Every editor, panel, card, sidebar, dialog, and background uses a named paper or stone tone.

### 2. Semantic rule

Colors may change in lightness and saturation between modes, but their meanings do not change. Orange is always control flow, amber is always callable behavior, cyan/teal is always structural type information, and so on.

### 3. Hierarchy rule

Elevation is created by moving between paper densities and temperatures. Raised elements may be lighter, but they never become luminous white.

### 4. Focus rule

Dark Emberveil's golden focus becomes ochre. It should appear in thin lines, carets, active tab marks, and keyboard focus rings rather than broad fills.

### 5. Comfort rule

Large surfaces maintain gentle contrast. Strong contrast is reserved for text and essential interactive states.

## Family relationship

Emberveil is the regular theme; Emberveil Dark is its dark companion. Both share the same design grammar, syntax hierarchy, and emotional character.

The two modes should feel like the same workspace under different physical conditions:

- **Emberveil Dark:** semantic light within a muted night atmosphere.
- **Emberveil:** semantic ink on dim paper.

Neither mode is subordinate, and neither should be generated automatically from the other. They should evolve together through shared semantic tokens and independently tuned presentation tokens.

## What makes Emberveil unique

Most light themes begin with white and then add color. Emberveil begins with material comfort and treats brightness as a limited resource. This makes it suitable for users who normally avoid light themes while still remaining recognizably light for those who prefer them.

Its identity comes from the combination of paper-like surfaces, dark semantic inks, the Emberveil color grammar, and the refusal to use white as the default answer to space and elevation.

## Boundaries

Emberveil must never drift toward white application canvases, pale low-contrast text, or pastel syntax that sacrifices readability. It also must not become sepia or nostalgic: the paper warmth should coexist with cool teal structure and modern component behavior.

## Future development

Future implementation should include:

- Shared semantic tokens with Emberveil Dark.
- Independently tuned surface and contrast tokens.
- VS Code and JetBrains light variants.
- Application components and chart palettes designed specifically for paper backgrounds.
- Accessibility testing across text sizes and interaction states.
- Real-world daily-use trials in bright offices, dim rooms, and mixed-light environments.
- Print and document adaptations, where the theme's material logic may be especially natural.
