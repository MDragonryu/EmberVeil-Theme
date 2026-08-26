# Emberveil editor themes for Database Workbench 5 Pro

This package installs **Emberveil Dark** and **Emberveil Light** as named editor color schemes for Upscene Database Workbench 5 Pro.

Database Workbench 5 exposes only its editor color-scheme categories here. These files do not attempt to recolor the application chrome, dialogs, toolbars, object tree, grids, or other UI outside the editor scheme system.

## Install

1. Close Database Workbench 5.
2. Run:

   ```powershell
   .\install.ps1
   ```

3. Start Database Workbench 5.
4. Open the editor/syntax-highlighting preferences and select **Emberveil Dark** or **Emberveil Light** from the available color schemes.

The installer copies both native `.col` color-scheme files into:

```text
%LOCALAPPDATA%\Database Workbench 5 Pro\Data
```

It does not change the active scheme automatically.

## Remove

Close Database Workbench 5 and run:

```powershell
.\uninstall.ps1
```

The script deletes only `Emberveil Dark.col` and `Emberveil Light.col` from the Database Workbench 5 Pro data directory.

## Mapping and limitations

The themes follow the canonical Emberveil syntax language as closely as Database Workbench 5's color-scheme format allows:

- keywords use Emberveil's signature orange and remain bold;
- functions use amber;
- data types and data-dictionary elements use teal/cyan;
- strings use green;
- numbers use mauve;
- comments use the muted comment tone and remain italic;
- ordinary symbols and default code remain neutral rather than receiving a misleading semantic accent;
- current-line, selection, read-only, block, routine, parenthesis, and gutter states use the corresponding Emberveil surface hierarchy.

Database Workbench 5 does not expose the richer semantic-token model available in VS Code or Zed, so properties, parameters, classes, documentation comments, and other fine-grained roles cannot all be represented independently. The implementation therefore prefers neutral fallbacks over inaccurate coloring, consistent with the RAD Studio adaptation.

The light variant is the regular Emberveil paper-light theme. It intentionally uses `#E4DED2` as the editor canvas rather than white. The dark variant uses the canonical `#242632` warm-neutral night canvas.
