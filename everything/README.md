# Emberveil for Everything 1.5

This package applies **Emberveil Light** and **Emberveil Dark** to the native Everything 1.5 main-window theme system.

Everything 1.5 supports separate Standard and Dark appearance values under **Tools > Options > Fonts and Colors**. Emberveil uses those native settings rather than replacing the application or patching its executable.

## Scope

The package themes the parts of the main Everything window exposed by the 1.5 font/color system, including the result list, menus, toolbar, search field, filter bar, headers, status bar, sidebars, preview/pane surfaces, selections, hover states, and accent color.

Windows dialogs are not skinned by Everything's theme system and therefore remain controlled by Windows.

Typography and unrelated Everything behavior are deliberately left untouched.

## Requirements

- Everything 1.5
- PowerShell 5.1 or newer
- Everything must be fully exited while installing or uninstalling

Closing the search window is not always enough because Everything can remain in the tray. Use **File > Exit** or exit it from the tray icon first.

## Install

From this directory:

```powershell
.\install.ps1
```

The installer searches the normal installed-build configuration locations, including `Everything-1.5a.ini` and `Everything.ini` under `%APPDATA%\Everything`.

For a portable or unusual installation, specify the active INI explicitly:

```powershell
.\install.ps1 -ConfigPath 'D:\Apps\Everything\Everything-1.5a.ini'
```

The script merges only the Emberveil appearance keys into the existing configuration. Before changing anything, it stores the previous values in:

```text
%LOCALAPPDATA%\Emberveil\Everything\pre-emberveil.json
```

After installation, start Everything and select **View > Theme > Standard**, **Dark**, or **User default**. Standard uses Emberveil Light; Dark uses Emberveil Dark. User default allows Everything to follow the operating-system preference while retaining both Emberveil variants.

## Uninstall

Exit Everything completely, then run:

```powershell
.\uninstall.ps1
```

The uninstaller restores the exact appearance values that existed before Emberveil was installed and removes values that did not previously exist. It does not overwrite indexing, search, keyboard, history, window, or other personal settings.

If the configuration file moved after installation, specify it explicitly:

```powershell
.\uninstall.ps1 -ConfigPath 'D:\Apps\Everything\Everything-1.5a.ini'
```

## Theme files

The files under `themes/` are intentionally small INI fragments rather than complete Everything configurations:

- `Emberveil Light.ini` contains the Standard-theme values.
- `Emberveil Dark.ini` contains the corresponding `dark_` values.

This keeps the package auditable and prevents it from carrying unrelated machine-specific settings.

## Emberveil mapping

The light appearance uses Emberveil's dim-paper surfaces (`#E4DED2`, `#D8D1C5`, `#DDD6CA`) with charcoal text (`#35383F`), cool selection (`#C4D3D8`), burnt-orange highlighting, and ochre focus.

The dark appearance uses the warm Mirage-like canvas (`#242632`) with deeper shell/sidebar surfaces (`#1D2029`, `#20232D`), warm-neutral text (`#CCCAC2`), raised slate surfaces, orange highlighting, and golden focus.

The goal is to preserve the Emberveil material hierarchy rather than flatten Everything into one background color.

## Notes

Everything currently does not provide a standalone theme-file manager. These settings live inside its normal INI configuration. The installer therefore performs a narrow merge and keeps its own reversible state instead of copying an entire configuration file.
