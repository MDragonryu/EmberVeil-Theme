# Emberveil Windows Full Mode

This directory is reserved for build-specific Emberveil `.msstyles` payloads.

Full mode is intentionally not implemented as a generic "copy this one visual style everywhere" mechanism. Windows visual-style resources are sensitive to shell changes between Windows builds, and a mismatched file can produce broken controls or incomplete rendering.

## Payload layout

For each tested Windows build, add:

```text
styles/<build>/Emberveil.msstyles
styles/<build>/Emberveil-Dark.msstyles
```

Example:

```text
styles/26100/Emberveil.msstyles
styles/26100/Emberveil-Dark.msstyles
```

The installer obtains the current build from `[Environment]::OSVersion.Version.Build` and will use only the matching directory.

## Authoring rules

1. Start from the Microsoft visual style belonging to the exact target Windows build.
2. Edit it locally with a current `.msstyles` editor such as msstyleEditor.
3. Do not commit an untouched or lightly renamed Microsoft base file as a convenience payload.
4. Map surfaces and interaction states to the canonical Emberveil tokens rather than applying a single hue shift.
5. Test both active and inactive windows, Explorer, legacy dialogs, context menus, buttons, text fields, checkboxes, list/tree views, scrollbars, selection states, disabled states, DPI scaling, and high-DPI mixed-monitor use.
6. Verify SecureUxTheme loading on the exact target build before declaring that build supported.
7. Re-test after cumulative or feature updates that alter visual-style resources.

## Dark mapping

Use these as the primary shell/material anchors:

- outer chrome: `#1D2029`
- main surface: `#242632`
- secondary shell/sidebar: `#20232D`
- panel: `#292C38`
- raised surface: `#303342`
- text: `#CCCAC2`
- subdued text: `#727D8E`
- active/primary accent: `#FF9F5B`
- focus: `#FFCC66`
- structural cool accent: `#73C7D6`

Avoid pure black, white text, cobalt-dominant chrome, and broad orange fills.

## Light mapping

- outer chrome: `#CEC6BA`
- main surface: `#E4DED2`
- secondary shell/sidebar: `#D8D1C5`
- panel: `#DDD6CA`
- raised surface: `#EEE7DB`
- text: `#35383F`
- subdued text: `#58616B`
- active/primary accent: `#A44012`
- focus: `#A86B00`
- structural cool accent: `#1C6570`
- selection wash: `#C4D3D8`

No broad surface should become white or near-white. The light style should read as paper and warm stone, not as a recolored default Windows light theme.

## Dependency boundary

SecureUxTheme is a user-managed dependency. The Emberveil scripts do not download, install, update, or uninstall it. Full mode only verifies that an expected installation artifact can be found before proceeding.
