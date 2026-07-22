# How to apply Emberveil in Trilium Notes

1. Create a new **Code** note in Trilium and name it `Emberveil`.
2. Set the code note's language/type to **CSS**. The theme will not load if the
   note remains plain text.
3. In **Owned Attributes**, add:

   ```text
   #appTheme=Emberveil
   #appThemeBase=next
   ```

4. Copy the complete contents of [`emberveil.css`](emberveil.css) into the note
   and save it.
5. Open **Options → Appearance → Theme** and select **Emberveil**.
6. Reload Trilium with <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> on macOS or
   <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> elsewhere.

Emberveil automatically follows the operating system's light or dark appearance.
To install an update, replace the entire contents of the same CSS note with the
new `emberveil.css`, save, and reload Trilium.
