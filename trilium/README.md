# Emberveil for Trilium Notes

This package adapts the full Emberveil family to Trilium Notes. It targets Trilium Notes `0.99.1` and uses Trilium's current **Next** theme as its base so the application keeps its native desktop, mobile, horizontal, and vertical layouts.

The single theme follows the operating-system appearance:

- **Light** uses Emberveil's dim paper surfaces, charcoal ink, burnt orange actions, teal structure, and ochre focus.
- **Dark** uses Emberveil Dark's smoky Mirage surfaces, warm semantic light, cool structure, and narrow golden focus.

## Install

For a compact checklist, see [How to apply Emberveil](HOW-TO-APPLY.md).

1. In Trilium, create a new **Code** note and set its language/type to **CSS**.
2. Name it `Emberveil`.
3. Open **Owned Attributes** and add both of these labels:

   ```text
   #appTheme=Emberveil
   #appThemeBase=next
   ```

4. Copy the complete contents of [`emberveil.css`](emberveil.css) into the note.
5. Press <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> on macOS, or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> elsewhere.
6. Open **Options → Appearance → Theme** and choose **Emberveil**.

Trilium's `next` theme base and Emberveil both use `prefers-color-scheme`, so the active family member changes with the operating system. No font, font size, pane size, or content-width preference is overridden.

## Coverage

The implementation maps Trilium's complete Next-theme variable surface and adds focused rules for areas whose defaults are not fully tokenized:

- window chrome, launcher, note tree, tabs, title bar, side panes, and scrollbars;
- buttons, inputs, checkboxes, selects, menus, quick search, tooltips, dialogs, toasts, and keyboard focus;
- note titles and rich-text content, links, quotes, tables, marks, inline code, fenced code, and highlight.js syntax;
- cards, promoted attributes, floating actions, collection lists, tables, boards, and calendars;
- selections, hover/active/disabled states, info/success/warning/error feedback, and protected/sync states;
- desktop and mobile layouts, reduced motion, and forced-colors fallbacks.

Large areas remain quiet and use close material steps. Orange is reserved for primary decisions and narrow active markers; teal carries structure and information; gold/ochre remains the keyboard-focus signal.

## Trilium code-note editor

Trilium treats the CodeMirror theme used by **code notes** as a separate application preference. Custom app-theme CSS cannot register a CodeMirror syntax theme. Emberveil therefore styles the code editor's frame, focus, search, panels, and completion popovers, while leaving token colors to **Options → Code Notes → Color scheme**.

For the closest bundled companion in Trilium `0.99.1`, use **VS Code Dark** with Emberveil Dark or **VS Code Light** with Emberveil. Rich-text code blocks are fully Emberveil-themed because their highlight.js classes are CSS-addressable.

## Validate

Run the local validator from this directory:

```sh
node scripts/validate-theme.mjs
```

It checks CSS structure, both canonical palettes, required Trilium mappings and feature selectors, unsafe broad white/black surfaces, and—when Trilium is installed in `/Applications`—the targeted Next-theme variables against the installed app bundle.

Open [`preview.html`](preview.html) in a browser for a lightweight application-shell smoke test. The preview follows the browser or operating-system appearance just like the installed theme.
