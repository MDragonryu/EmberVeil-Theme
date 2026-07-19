# Emberveil Theme

Emberveil is a personal cross-application theme family built around comfortable contrast, warm semantic color, and surfaces designed for prolonged use.

The repository contains the primary Emberveil family and two earlier theme explorations that remain as design references.

## Core Emberveil family

- **Emberveil design system** - the canonical, self-theming family reference for identity, semantic colors, syntax, components, accessibility, and implementation. [Open design system](emberveil/emberveil-design-system.html)
- **Emberveil** - the regular paper-light theme, using dim paper surfaces instead of bright white. [Preview](emberveil/previews/emberveil.html) · [Specification](emberveil/specs/emberveil.md)
- **Emberveil Dark** - the Ayu Mirage-led dark companion. [Preview](emberveil/previews/emberveil-dark.html) · [Specification](emberveil/specs/emberveil-dark.md)

## Try it in VS Code

The installable VS Code extension contains both core themes. Download or open the latest build, [`vscode/dist/emberveil-theme-0.1.3.vsix`](vscode/dist/emberveil-theme-0.1.3.vsix), then:

1. Open the Command Palette in VS Code.
2. Run **Extensions: Install from VSIX...** and select the file.
3. Run **Preferences: Color Theme**.
4. Choose **Emberveil** or **Emberveil Dark**.

The implementation covers workbench chrome, editor and selection states, TextMate syntax scopes, semantic tokens, terminal ANSI colors, Git and diff states, diagnostics, notebooks, and testing UI. See the [VS Code extension notes](vscode/README.md) for local development and validation.

Deferred visual-audit findings are preserved in [VS Code deferred refinements](emberveil/notes/vscode-review-deferred-refinements.md).

## Ideas and inspirations

- **Aurora Forge** - a more energetic synthesis of Ayu Mirage, Nord, Cobalt2, JetBrains/Darcula, and personal preferences. [Preview](ideas/aurora-forge/preview.html) · [Specification](ideas/aurora-forge/spec.md)
- **Vermilion Fjord** - a restrained charcoal concept derived from a manually configured Delphi environment. [Preview](ideas/vermilion-fjord/preview.html) · [Specification](ideas/vermilion-fjord/spec.md)

## Repository structure

```text
emberveil/
  emberveil-design-system.html  Canonical family design and implementation reference
  previews/    Browser-ready Emberveil prototypes
  specs/       Core family design specifications
vscode/
  themes/      Installable VS Code theme definitions
  dist/        Ready-to-install VSIX package
ideas/
  aurora-forge/
  vermilion-fjord/
```

## Current status

Emberveil is the active direction. The files under `ideas/` preserve useful experiments and inspiration, but they are not part of the primary theme family. Emberveil and Emberveil Dark are now packaged as a usable VS Code extension; implementations for other IDEs and a production design-token library remain future work.
