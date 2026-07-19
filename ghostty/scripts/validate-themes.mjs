import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const themeDirectory = resolve(scriptDirectory, '../themes');
const themeNames = ['Emberveil Dark', 'Emberveil Light'];
const singleKeys = [
  'background',
  'foreground',
  'cursor-color',
  'cursor-text',
  'selection-background',
  'selection-foreground'
];
const allowedKeys = new Set(['palette', ...singleKeys]);

function parseTheme(source, name) {
  const values = new Map();
  const palette = new Map();

  source.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const separator = trimmed.indexOf('=');
    if (separator < 1) throw new Error(`${name}:${index + 1} is not a key-value line`);

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!allowedKeys.has(key)) throw new Error(`${name}:${index + 1} has unexpected key ${key}`);

    if (key === 'palette') {
      const match = /^(\d+)=((?:#[0-9A-F]{6}))$/i.exec(value);
      if (!match) throw new Error(`${name}:${index + 1} has invalid palette entry ${value}`);
      const paletteIndex = Number(match[1]);
      if (palette.has(paletteIndex)) throw new Error(`${name} repeats palette index ${paletteIndex}`);
      palette.set(paletteIndex, match[2].toUpperCase());
      return;
    }

    if (values.has(key)) throw new Error(`${name} repeats ${key}`);
    if (!/^#[0-9A-F]{6}$/i.test(value)) throw new Error(`${name}:${index + 1} has invalid ${key} color ${value}`);
    values.set(key, value.toUpperCase());
  });

  for (const key of singleKeys) {
    if (!values.has(key)) throw new Error(`${name} is missing ${key}`);
  }
  for (let index = 0; index < 16; index += 1) {
    if (!palette.has(index)) throw new Error(`${name} is missing palette index ${index}`);
  }
  if (palette.size !== 16) throw new Error(`${name} has ${palette.size} palette entries instead of 16`);

  return { palette, values };
}

const ghosttyCandidates = [
  process.env.GHOSTTY_BIN,
  '/Applications/Ghostty.app/Contents/MacOS/ghostty',
  'ghostty'
].filter(Boolean);

let ghosttyBinary = null;
for (const candidate of ghosttyCandidates) {
  if (candidate.includes('/') && !existsSync(candidate)) continue;
  const result = spawnSync(candidate, ['+version'], { encoding: 'utf8' });
  if (!result.error && result.status === 0) {
    ghosttyBinary = candidate;
    break;
  }
}

for (const name of themeNames) {
  const path = resolve(themeDirectory, name);
  const source = await readFile(path, 'utf8');
  const parsed = parseTheme(source, name);

  if (ghosttyBinary) {
    const result = spawnSync(ghosttyBinary, ['+validate-config', `--config-file=${path}`], { encoding: 'utf8' });
    if (result.status !== 0) {
      throw new Error(`${name} failed Ghostty validation:\n${result.stderr || result.stdout}`);
    }
  }

  console.log(`${name}: ${parsed.palette.size} ANSI colors and ${parsed.values.size} interface colors validated.`);
}

console.log(ghosttyBinary ? `Native Ghostty validation passed with ${ghosttyBinary}.` : 'Ghostty is unavailable; structural validation passed.');

