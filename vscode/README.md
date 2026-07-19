# Emberveil for VS Code

Emberveil is a paired VS Code theme family built for prolonged use:

- **Emberveil Dark** uses warm charcoal and smoky slate surfaces with luminous orange, amber, cyan, lichen, mauve, and coral syntax.
- **Emberveil** uses dim paper surfaces and darker semantic inks. Large surfaces never use bright white.

Both themes preserve the same semantic language: orange control flow, amber callables, teal types, green strings, mauve numbers, coral properties, and a two-level comment system.

## Install the packaged extension

1. Open VS Code.
2. Run **Extensions: Install from VSIX...** from the Command Palette.
3. Select `dist/emberveil-theme.vsix`.
4. Run **Preferences: Color Theme** and choose **Emberveil** or **Emberveil Dark**.

## Develop locally

Open this `vscode` directory in VS Code and press `F5`. In the Extension Development Host, select either Emberveil theme from the color theme picker. Theme JSON changes update live.

Run `npm run check` to validate the manifest, theme files, color values, and required semantic roles.
