# Emberveil for Ghostty

This package contains paired native Ghostty themes:

- **Emberveil Dark** — smoky, low-glare terminal surfaces with warm semantic ANSI colors.
- **Emberveil Light** — a dim paper terminal that avoids bright white while preserving the same color meanings.

The themes control only color: background, foreground, cursor, selection, and ANSI palette entries 0–15. They do not change fonts, opacity, padding, window behavior, keybindings, or shell integration.

## Install on this Mac

Ghostty looks up named user themes in `~/.config/ghostty/themes` even when the macOS app stores its main configuration under `~/Library/Application Support/com.mitchellh.ghostty`.

To install both themes, back up the current configuration, enable automatic switching, and validate the result with Ghostty:

```sh
node scripts/install-local.mjs
```

For a manual installation, use the steps below.

```sh
mkdir -p "$HOME/.config/ghostty/themes"
cp "themes/Emberveil Dark" "$HOME/.config/ghostty/themes/Emberveil Dark"
cp "themes/Emberveil Light" "$HOME/.config/ghostty/themes/Emberveil Light"
```

Then add one of the following lines to Ghostty's configuration file.

Automatic light/dark switching:

```ini
theme = dark:Emberveil Dark,light:Emberveil Light
```

Always dark:

```ini
theme = Emberveil Dark
```

Always light:

```ini
theme = Emberveil Light
```

On this Mac the configuration file is:

```text
~/Library/Application Support/com.mitchellh.ghostty/config
```

Reload Ghostty with **Command+Shift+,** or restart it.

## Design mapping

The package consumes the canonical terminal colors from the VS Code implementations so terminal output remains consistent across Emberveil applications.

| Role | Dark | Light |
| --- | --- | --- |
| Background | `#1D2029` | `#D8D1C5` |
| Foreground | `#CCCAC2` | `#35383F` |
| Cursor | `#FFCC66` | `#A86B00` |
| Selection | `#3A465C` | `#C4D3D8` |
| Error / ANSI red | `#F07178` | `#A33B42` |
| Success / ANSI green | `#9FCF86` | `#46661F` |
| Warning / ANSI yellow | `#FFD173` | `#875900` |
| Structural cyan | `#73C7D6` | `#1C6570` |
| Numeric magenta | `#C8ABE6` | `#704C87` |

The light terminal uses the sidebar-paper surface rather than the lighter editor canvas. This keeps a full terminal window subdued and prevents it from becoming a large bright panel.

## Regenerate and validate

```sh
node scripts/generate-themes.mjs
node scripts/validate-themes.mjs
```

The generator reads the terminal palette directly from the two VS Code theme JSON files. The validator checks structure and color syntax, then uses the installed Ghostty executable when available.
