import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '../..');
const outputDirectory = resolve(scriptDirectory, '../themes');

const variants = {
  'Emberveil Dark': {
    source: resolve(repositoryRoot, 'vscode/themes/emberveil-dark-color-theme.json'),
    selectionForeground: 'editor.selectionForeground'
  },
  'Emberveil Light': {
    source: resolve(repositoryRoot, 'vscode/themes/emberveil-color-theme.json'),
    selectionForeground: 'editor.selectionForeground'
  }
};

const paletteKeys = [
  'terminal.ansiBlack',
  'terminal.ansiRed',
  'terminal.ansiGreen',
  'terminal.ansiYellow',
  'terminal.ansiBlue',
  'terminal.ansiMagenta',
  'terminal.ansiCyan',
  'terminal.ansiWhite',
  'terminal.ansiBrightBlack',
  'terminal.ansiBrightRed',
  'terminal.ansiBrightGreen',
  'terminal.ansiBrightYellow',
  'terminal.ansiBrightBlue',
  'terminal.ansiBrightMagenta',
  'terminal.ansiBrightCyan',
  'terminal.ansiBrightWhite'
];

function opaqueHex(value, role) {
  if (!/^#[0-9A-F]{6}(?:[0-9A-F]{2})?$/i.test(value ?? '')) {
    throw new Error(`${role} is not an RGB or RGBA hex color: ${value}`);
  }
  return value.slice(0, 7).toUpperCase();
}

function requireColor(colors, key) {
  return opaqueHex(colors[key], key);
}

function renderTheme(name, definition, colors) {
  const lines = [
    `# ${name} for Ghostty`,
    '# Generated from the canonical Emberveil VS Code terminal palette.',
    '# Color-only by design: no typography, spacing, opacity, or behavior.',
    ''
  ];

  paletteKeys.forEach((key, index) => {
    lines.push(`palette = ${index}=${requireColor(colors, key)}`);
  });

  lines.push(
    '',
    `background = ${requireColor(colors, 'terminal.background')}`,
    `foreground = ${requireColor(colors, 'terminal.foreground')}`,
    `cursor-color = ${requireColor(colors, 'terminalCursor.foreground')}`,
    `cursor-text = ${requireColor(colors, 'terminalCursor.background')}`,
    `selection-background = ${requireColor(colors, 'terminal.selectionBackground')}`,
    `selection-foreground = ${requireColor(colors, definition.selectionForeground)}`,
    ''
  );

  return `${lines.join('\n')}\n`;
}

await mkdir(outputDirectory, { recursive: true });

for (const [name, definition] of Object.entries(variants)) {
  const source = JSON.parse(await readFile(definition.source, 'utf8'));
  const rendered = renderTheme(name, definition, source.colors);
  await writeFile(resolve(outputDirectory, name), rendered, 'utf8');
  console.log(`Generated Ghostty theme: ${name}`);
}

