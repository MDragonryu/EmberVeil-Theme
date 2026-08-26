# Emberveil for Windows Terminal

This package installs paired native Windows Terminal color schemes:

- **Emberveil Dark** — warm smoky terminal surfaces with localized semantic light.
- **Emberveil Light** — dim technical paper with dark semantic ink and no broad white canvas.

The package is deliberately color-only. It does not change fonts, padding, opacity, acrylic, background images, keybindings, profile commands, or shell behavior.

## Design mapping

The Windows Terminal schemes use the same canonical terminal palette already shared by the Emberveil VS Code and Ghostty implementations. This keeps shell output semantically consistent across applications instead of inventing a Windows-specific recolor.

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

The light scheme deliberately uses the denser `#D8D1C5` sidebar-paper surface rather than the lighter editor canvas. A terminal is usually a large uninterrupted field, so this keeps the light variant subdued during long sessions.

The canonical design system currently documents one intentional edge case: explicit ANSI white in the light terminal is close to the paper background. Normal foreground text remains dark and readable. Keep this mapping unless real software demonstrates a practical problem; if that happens, test a semantic remap rather than brightening the whole theme.

## Install

Run from PowerShell:

```powershell
.\install.ps1
```

The installer copies the fragment to the current user's supported Windows Terminal fragment directory:

```text
%LOCALAPPDATA%\Microsoft\Windows Terminal\Fragments\Emberveil\emberveil.json
```

Windows Terminal reads JSON fragments as extensions to its settings, so the installer does not modify `settings.json`.

After installation, open **Windows Terminal > Settings**, select a profile, open **Appearance**, and choose **Emberveil Dark** or **Emberveil Light** under **Color scheme**.

## Automatic light/dark switching

Windows Terminal can switch color schemes with its application theme. In the profile you want to configure, use:

```json
"colorScheme": {
  "light": "Emberveil Light",
  "dark": "Emberveil Dark"
}
```

If the Terminal application theme follows the system theme, this makes the profile follow Windows light/dark mode as well.

The installer does not add this profile setting automatically because profiles are personal configuration and may intentionally use different schemes.

## Uninstall

Run:

```powershell
.\uninstall.ps1
```

The uninstaller removes only the Emberveil fragment and removes its now-empty fragment directory. It does not edit any Terminal profiles or other settings.

If an already-open Terminal window still lists the schemes, close all Windows Terminal windows and start it again.

## Files

```text
windows-terminal/
  README.md
  install.ps1
  uninstall.ps1
  themes/
    emberveil.json
```

## Platform notes

Windows Terminal requires every ANSI table entry from `black` through `brightWhite` for a color scheme supplied through a JSON fragment. `cursorColor` and `selectionBackground` are included as Emberveil-specific interaction states.

The package targets the supported per-user fragment mechanism rather than the Store package's `LocalState\settings.json`, so it works independently of whether Terminal itself was installed from the Microsoft Store or as an unpackaged application.
