# Vermilion Fjord

**Status:** Independent concept theme, prototype study 01  
**Primary mode:** Dark  
**Preview:** [preview.html](preview.html)

## Purpose

Vermilion Fjord is a dark editor and application theme built from the creator's manually configured Delphi environment. That environment existed because Delphi offered limited theming support, so a small set of personally meaningful colors had to do most of the work. This concept preserves that directness and turns it into a coherent theme system.

The theme is intended for people who want a dark working environment without pure black surfaces and who prefer a small number of unmistakable semantic signals over comprehensive rainbow syntax highlighting.

## Initial direction

The original direction was to formalize the strongest traits visible in the Delphi setup:

- A neutral charcoal editor rather than black or strongly blue navy.
- Bright vermilion control-flow keywords as the dominant visual signal.
- Warm off-white text for most ordinary program content.
- Vivid green comments that clearly separate human annotation from executable code.
- Cyan compiler directives and region markers.
- A nearly blue-black current line.
- Colored nesting guides for scope and structure.

The result deliberately stays close to the source material. It is not an attempt to blend every admired theme. Its value is that it captures the creator's unconsciously chosen working preferences with very little reinterpretation.

## Core character

Vermilion Fjord feels practical, immediate, and high-signal. Most of the editor remains visually quiet. Control flow is impossible to miss because keywords carry both strong color and typographic weight. Ordinary identifiers are intentionally not divided into many categories, allowing the code to retain a text-like rhythm.

The experience can be summarized as:

> Neutral charcoal surroundings with hot vermilion structure, warm text, living green annotation, and cyan special syntax.

## Color system

| Role | Color | Intent |
|---|---:|---|
| Editor background | `#292D30` | Neutral charcoal with a slight cool bias; dark without becoming black. |
| Primary text | `#F9EEE5` | Warm off-white that avoids the clinical appearance of pure white. |
| Keywords | `#FF6238` | The theme's signature vermilion; reserved for language structure and control flow. |
| Directives | `#31C6EB` | Cyan for compiler directives, regions, and special language channels. |
| Comments | `#9BE470` | Bright green for human-authored context and annotations. |
| Strings | `#D5C88B` | Muted warm yellow that remains subordinate to keywords. |
| Numbers | `#D6A4E8` | Soft mauve for constants and numeric literals. |
| Types | `#91D7D0` | Pale teal for optional semantic differentiation. |
| Current line | `#061B22` | A deep blue-black focus band. |
| Gutter | `#202427` | A quieter extension of the editor surface. |

## Syntax language

The syntax model is intentionally restrained:

- **Keywords and control flow** are vermilion and visually dominant.
- **Ordinary identifiers, methods, types, and punctuation** may remain close to the primary text color when semantic scopes are unavailable or unnecessary.
- **Comments** are green and italic, making prose recognizable at a glance.
- **Compiler directives and regions** are cyan, separating them from executable syntax.
- **Strings, numbers, and types** have secondary colors, but these should never compete with keywords.
- **Nesting guides** may use subdued blue, green, and violet to explain scope without coloring the entire token stream.

## Interface behavior

The UI follows the editor's restrained hierarchy:

- Large surfaces stay charcoal and differ primarily through small luminance changes.
- Active navigation uses a dark cyan surface and a vermilion edge.
- Primary actions use vermilion.
- Status and focus information may use cyan.
- The current line is substantially darker than its surroundings.
- Borders are visible enough to explain structure but never bright.

## What makes Vermilion Fjord unique

Vermilion Fjord is the most personal and least synthetic of the theme studies. It is a formalized version of a real working configuration rather than a blend of admired commercial or community themes. Its strongest idea is not any individual color; it is the decision to let a few colors carry almost all meaning.

This makes the theme especially suitable for environments with limited token metadata, legacy IDEs, terminals, or applications where a compact palette is easier to implement reliably.

## Boundaries

Vermilion Fjord should not gradually become a full-spectrum semantic theme. Excessive coloring would remove the contrast between structural keywords and ordinary program content. It also should not drift toward black backgrounds or colder, strongly blue application chrome.

## Future development

Potential implementations include:

- A Delphi color configuration matching the concept as closely as the IDE permits.
- A minimal VS Code theme for users who prefer keyword-led syntax.
- Terminal and console palettes.
- A compact application token set for internal tools and legacy interfaces.

This concept should remain an independent theme even if other theme studies later become the main cross-application family.
