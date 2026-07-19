# Emberveil for Zed

This Zed extension installs both members of the Emberveil family:

- **Emberveil Dark** — smoky charcoal and slate surfaces with warm, luminous syntax.
- **Emberveil** — the paper-light companion, built from dim parchment surfaces rather than bright white.

Both use the same semantic language: orange keywords, amber functions, teal types, green strings, mauve constants and numbers, coral markup attributes, and neutral variables and data properties.

## Install as a development extension

1. Open Zed's Extensions page.
2. Select **Install Dev Extension**.
3. Choose this `zed` directory—the folder containing `extension.toml`.
4. Open the theme selector with `cmd-k cmd-t` on macOS or `ctrl-k ctrl-t` on Linux/Windows.
5. Choose **Emberveil** or **Emberveil Dark**.

Installing this one extension makes both themes available. No Rust build or language server is required because this is a theme-only extension.

## Follow the operating-system appearance

Add this to Zed's `settings.json` to use the paired family automatically:

```json
{
  "theme": {
    "mode": "system",
    "light": "Emberveil",
    "dark": "Emberveil Dark"
  }
}
```

## Validate locally

Run the repository validator:

```sh
node scripts/validate-theme.mjs
```

To additionally verify every top-level style key against a downloaded copy of Zed's v0.2 theme schema:

```sh
node scripts/validate-theme.mjs /path/to/zed-theme-schema-v0.2.0.json
```

The implementation deliberately asserts the key live-review refinement: ordinary variables, object/JSON properties, and other data names use the neutral editor foreground. Keyword orange remains reserved for language structure.

