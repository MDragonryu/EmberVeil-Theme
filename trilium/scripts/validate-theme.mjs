import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const themePath = path.resolve(scriptDirectory, "..", "emberveil.css");
const css = fs.readFileSync(themePath, "utf8");

assert(css.trim().length > 0, "Theme CSS is empty");
assert.match(css, /:root:root\s*\{/, "Root variables must outrank Trilium's later-loaded base theme");
assert.match(css, /@media\s*\(prefers-color-scheme:\s*dark\)/, "Missing adaptive dark mode");
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, "Missing reduced-motion handling");
assert.match(css, /@media\s*\(forced-colors:\s*active\)/, "Missing forced-colors handling");

let depth = 0;
let quote = null;
let escaped = false;
let inComment = false;
for (let index = 0; index < css.length; index += 1) {
    const character = css[index];
    const next = css[index + 1];

    if (inComment) {
        if (character === "*" && next === "/") {
            inComment = false;
            index += 1;
        }
        continue;
    }

    if (!quote && character === "/" && next === "*") {
        inComment = true;
        index += 1;
        continue;
    }

    if (quote) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === quote) quote = null;
        continue;
    }

    if (character === '"' || character === "'") quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}") depth -= 1;

    assert(depth >= 0, `Unexpected closing brace at offset ${index}`);
}
assert.equal(depth, 0, "Unbalanced CSS braces");
assert.equal(quote, null, "Unterminated CSS string");
assert.equal(inComment, false, "Unterminated CSS comment");

const requiredColors = [
    "#cec6ba", "#d8d1c5", "#e4ded2", "#ddd6ca", "#eee7db",
    "#35383f", "#a44012", "#875900", "#1c6570", "#46661f",
    "#704c87", "#914321", "#58616b", "#45653a", "#a86b00",
    "#1d2029", "#20232d", "#242632", "#292c38", "#303342",
    "#cccac2", "#ff9f5b", "#ffd173", "#73c7d6", "#b8d982",
    "#c8abe6", "#f29e74", "#727d8e", "#9fcf86", "#ffcc66"
];
for (const color of requiredColors) {
    assert(css.toLowerCase().includes(color), `Missing canonical color ${color}`);
}

const requiredVariables = [
    "--main-background-color", "--main-text-color", "--main-border-color",
    "--left-pane-background-color", "--launcher-pane-vert-background-color",
    "--launcher-pane-horiz-background-color", "--active-tab-background-color",
    "--input-focus-outline-color", "--menu-background-color",
    "--modal-background-color", "--tooltip-background-color",
    "--selection-background-color", "--card-background-color",
    "--calendar-day-highlight-background", "--ck-editor-toolbar-button-on-background"
];
for (const variable of requiredVariables) {
    assert(css.includes(`${variable}:`), `Missing Trilium mapping ${variable}`);
}

const requiredSelectors = [
    ".fancytree-node.fancytree-active::after", ".note-tab[active]",
    ".note-detail-text", ".hljs-keyword", ".cm-editor.cm-focused",
    ".alert-danger", ".tabulator", ".board-view", ".fc"
];
for (const selector of requiredSelectors) {
    assert(css.includes(selector), `Missing coverage selector ${selector}`);
}

const declarations = [...css.matchAll(/([\w-]+)\s*:\s*([^;{}]+);/g)];
for (const [, property, rawValue] of declarations) {
    const value = rawValue.trim().toLowerCase();
    if (!["background", "background-color"].includes(property)) continue;
    assert(!["white", "#fff", "#ffffff", "black", "#000", "#000000"].includes(value),
        `Broad surface declaration uses prohibited extreme: ${property}: ${rawValue.trim()}`);
}

const appAsar = "/Applications/Trilium Notes.app/Contents/Resources/app.asar";
if (fs.existsSync(appAsar)) {
    const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "emberveil-trilium-validate-"));
    try {
        for (const file of ["theme-next-light.css", "theme-next-dark.css"]) {
            execFileSync("npx", ["--yes", "@electron/asar", "extract-file", appAsar,
                `public/stylesheets/${file}`], { cwd: temporaryDirectory, stdio: "pipe" });
            const source = fs.readFileSync(path.join(temporaryDirectory, file), "utf8");
            for (const variable of requiredVariables) {
                assert(source.includes(`${variable}:`),
                    `${variable} is not supported by installed Trilium ${file}`);
            }
        }
    } finally {
        fs.rmSync(temporaryDirectory, { recursive: true, force: true });
    }
}

console.log("Emberveil for Trilium: validation passed.");
