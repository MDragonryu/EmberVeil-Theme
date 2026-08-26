# EmberVeil Dark for DB Browser for SQLite

This folder contains the EmberVeil Dark code-editor palette for DB Browser for SQLite (DB4S).

DB4S does not expose a standalone code-theme format. Instead, syntax highlighting is stored in the application's settings under the `syntaxhighlighter` group. Current DB4S builds can import and export settings as `.ini` files, so `emberveil-dark.ini` is provided as a minimal importable preset containing only the syntax-highlighting values.

## Installation

1. Open **Edit → Preferences** in DB Browser for SQLite.
2. Use **Import Settings** and select `emberveil-dark.ini`.
3. Restart DB Browser if the editor does not immediately repaint.

The import is intentionally minimal. It does not replace unrelated DB4S preferences.

## Palette mapping

DB4S exposes fewer syntax categories than EmberVeil itself, so the closest semantic mapping is used.

| DB4S role | EmberVeil role | Value |
|---|---|---:|
| Background | Editor canvas | `#242632` |
| Foreground | Primary text | `#CCCAC2` |
| Keyword | Control flow / keywords | `#FF9F5B` |
| Function | Functions | `#FFD173` |
| Table | Structural type / schema object | `#73C7D6` |
| Comment | Standard comment | `#727D8E` |
| Identifier | Property / named identifier | `#F29E74` |
| String | String | `#B8D982` |
| Current line | Current line | `#2D3040` |
| Highlight | Focus | `#FFCC66` |
| Selected foreground | Primary text | `#CCCAC2` |
| Selected background | Raised surface | `#303342` |
| NULL | Muted secondary text | `#727D8E` |

Keywords are bold and comments italicized. Other categories remain regular so the palette, rather than font decoration, carries most of the hierarchy.

## DB4S limitations

DB Browser does not currently expose distinct syntax roles for EmberVeil's number, type, property, and meaningful-documentation categories. The preset therefore collapses those roles into the nearest DB4S categories rather than introducing unsupported distinctions.

This preset changes the SQL/code editor colors only. Application chrome is controlled separately by DB4S's own application-style setting.

## Manual setup

If importing the `.ini` preset is undesirable, the same colors can be entered manually under **Preferences → SQL → Syntax highlighting / Code style** using the table above.

## Source palette

The mapping follows the canonical EmberVeil Dark specification in `emberveil/specs/emberveil-dark.md`.