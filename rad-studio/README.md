# Emberveil editor themes for RAD Studio 12.3 Athens

This package installs **Emberveil Dark** and **Emberveil Light** as named Code Editor Color SpeedSettings for RAD Studio 12.3 (`BDS 23.0`). It does not change the RAD Studio IDE style, VCL style, Object Inspector, Tool Palette, layout, toolbars, or form designers.

## Install

1. Close every RAD Studio window.
2. Optional but recommended: open Command Prompt and back up the current editor-color registry branch:

   ```bat
   reg export "HKCU\Software\Embarcadero\BDS\23.0\Editor\Highlight" "%USERPROFILE%\Desktop\RAD-Studio-12.3-editor-colors-backup.reg" /y
   ```

3. Double-click [`12.3/editor/install-emberveil-editor-themes.reg`](12.3/editor/install-emberveil-editor-themes.reg) and accept the Windows Registry prompt.
4. Start RAD Studio.
5. Open **Tools > Options > Editor > Color**.
6. Choose **Emberveil Dark** or **Emberveil Light** from **Color SpeedSetting**, then save.

Importing the file only adds the two named schemes. It deliberately does not select one or overwrite the active editor scheme.

RAD Studio 12.3 can also color the editor scrollbar from the active editor scheme. If desired, enable **Tools > Options > Editor > Scroll Bar > Apply editor theme colors to the scroll bar**.

## Remove

1. In RAD Studio, switch to another Color SpeedSetting and close the IDE.
2. Double-click [`12.3/editor/uninstall-emberveil-editor-themes.reg`](12.3/editor/uninstall-emberveil-editor-themes.reg).

The removal file deletes only the two Emberveil custom-theme branches.

## Mapping and limitations

The schemes preserve the established Emberveil syntax language wherever RAD Studio exposes an equivalent editor category:

- reserved words are signature orange and bold;
- identifiers, symbols, and plain text remain calm neutral foregrounds;
- strings and characters are green;
- numbers and hexadecimal values are mauve;
- compiler directives and regions use the same blue as VS Code HTML/XML tags;
- comments are muted and italic;
- tags use the matching blue, while links use teal;
- selection, current line, search, diff, breakpoint, execution, and gutter states use paired Emberveil surfaces.

RAD Studio's classic highlighter exposes one broad **Identifier** category. It cannot independently color functions, types, properties, parameters, and ordinary variables the way VS Code or Zed semantic highlighting can. Emberveil therefore keeps all identifiers neutral—the calmer choice established during the VS Code review—instead of applying an inaccurate accent to every name.

## Regenerate and validate

Run:

```sh
node scripts/generate-editor-registry.mjs
```

The generator writes both `.reg` files with Windows CRLF line endings and verifies that the installer contains exactly two 40-element custom themes under the RAD Studio 12 registry branch.
