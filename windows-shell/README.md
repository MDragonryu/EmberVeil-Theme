# Emberveil for the Windows Desktop Shell

This package brings the Emberveil family to the Windows desktop shell through two deliberately separate installation modes.

## Choose a mode

### Safe mode

Safe mode uses only Windows' normal theme and personalization mechanisms. It does **not** patch the theme service, install unsigned visual styles, replace system files, or depend on third-party shell modification software.

It installs paired `.theme` files and applies the Emberveil light/dark preference and accent mapping.

Use Safe mode when you want a low-maintenance Emberveil-flavoured Windows desktop that remains inside the normal Windows theming model.

```powershell
.\install.ps1 -Mode Safe -Variant Dark
# or
.\install.ps1 -Mode Safe -Variant Light
```

Safe mode is the default if `-Mode` is omitted.

### Full mode

Full mode is an **opt-in advanced configuration**. It includes everything Safe mode does and additionally uses a custom `.msstyles` visual style to theme classic Win32 controls and shell surfaces that Windows does not expose through normal personalization.

Full mode requires:

1. A Windows-build-compatible Emberveil `.msstyles` payload in `full\styles\<build>\`.
2. SecureUxTheme installed and enabled by the user.
3. Administrator rights when copying visual-style resources into `%WINDIR%\Resources\Themes`.

```powershell
.\install.ps1 -Mode Full -Variant Dark
# or
.\install.ps1 -Mode Full -Variant Light
```

The installer prints a warning describing these changes and requires an explicit confirmation before it touches the visual-style path. `-Mode Full` never happens implicitly.

## What each mode changes

| Area | Safe | Full |
| --- | --- | --- |
| Windows light/dark preference | Yes | Yes |
| Emberveil accent mapping | Yes | Yes |
| `.theme` files | Yes | Yes |
| Explorer / classic Win32 visual style | Windows default | Emberveil `.msstyles` where supported |
| Third-party theme patching | No | Requires SecureUxTheme |
| System-file replacement | No | No |
| Build sensitivity | Low | High; `.msstyles` must match the Windows build |
| Update maintenance | Low | Re-test after major Windows updates |

## Design mapping

The Windows package follows the canonical Emberveil design specifications rather than treating the shell as a generic orange recolor.

### Emberveil Dark

- Shell: `#1D2029`
- Main surface: `#242632`
- Sidebar/secondary shell: `#20232D`
- Panel: `#292C38`
- Raised surface: `#303342`
- Primary text: `#CCCAC2`
- Primary Emberveil accent: `#FF9F5B`
- Focus: `#FFCC66`

Broad surfaces stay charcoal/plum-slate and deliberately avoid pure black. Accent color is localized instead of painting large shell areas orange.

### Emberveil Light

- Shell: `#CEC6BA`
- Main surface: `#E4DED2`
- Sidebar: `#D8D1C5`
- Panel: `#DDD6CA`
- Raised surface: `#EEE7DB`
- Primary text: `#35383F`
- Primary Emberveil accent: `#A44012`
- Focus: `#A86B00`

Light mode uses warm paper and stone surfaces. It intentionally avoids white application chrome.

## Why Full mode is build-specific

Windows visual styles are binary `.msstyles` resources. Modern editors modify a Microsoft base visual style; they do not provide a stable declarative format from which a complete Windows 11 style can be recreated independently.

For that reason this repository does **not** redistribute Microsoft's `aero.msstyles` as a base file. Emberveil full styles must be authored and tested against a specific Windows build and stored as generated Emberveil payloads under:

```text
full/styles/<Windows build>/Emberveil.msstyles
full/styles/<Windows build>/Emberveil-Dark.msstyles
```

The Full installer checks the current build and refuses to install a payload for a different build. This is deliberate: silently installing a mismatched visual style is exactly the kind of fragile behaviour this package is intended to avoid.

## SecureUxTheme

Windows normally refuses unsigned third-party visual styles. Full mode therefore expects SecureUxTheme to have been installed separately by the user.

The Emberveil installer does not download, silently install, or update SecureUxTheme. Keeping that dependency separate makes the trust boundary obvious and lets the user decide whether to patch Windows' theme-loading behaviour.

Project: https://github.com/namazso/SecureUxTheme

## Uninstall

Safe-only removal:

```powershell
.\uninstall.ps1 -Mode Safe
```

Full removal:

```powershell
.\uninstall.ps1 -Mode Full
```

Full removal deletes only the Emberveil visual-style directory installed by this package. It does not uninstall SecureUxTheme because that is an independently installed system component.

## Files

```text
windows-shell/
  README.md
  install.ps1
  uninstall.ps1
  safe/
    Emberveil.theme
    Emberveil-Dark.theme
  full/
    README.md
    styles/
      .gitkeep
```

## Current status

Safe mode is directly usable.

The Full-mode installer and build-safety model are implemented, but a full visual-style payload must be authored and visually tested for each supported Windows build before it is added under `full/styles/<build>/`. This separation is intentional; the repository will not ship an untested or mismatched `.msstyles` file merely to make Full mode appear complete.
