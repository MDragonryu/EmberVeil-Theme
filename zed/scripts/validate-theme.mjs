import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const themePath = resolve(root, 'themes/emberveil.json');
const family = JSON.parse(await readFile(themePath, 'utf8'));
const colorPattern = /^#[0-9a-f]{6}([0-9a-f]{2})?$/i;
const expectedThemes = new Map([
  ['Emberveil Dark', 'dark'],
  ['Emberveil', 'light']
]);
const requiredStyleKeys = [
  'background', 'surface.background', 'elevated_surface.background',
  'panel.background', 'title_bar.background', 'status_bar.background',
  'editor.background', 'editor.foreground', 'editor.active_line.background',
  'editor.line_number', 'editor.active_line_number', 'text', 'text.muted',
  'border', 'border.focused', 'element.hover', 'element.selected',
  'error', 'warning', 'success', 'info', 'terminal.background',
  'terminal.foreground', 'syntax'
];
const requiredSyntaxKeys = [
  'primary', 'variable', 'property', 'variable.parameter', 'keyword', 'operator',
  'function', 'type', 'string', 'number', 'constant', 'comment', 'comment.doc',
  'tag', 'attribute', 'punctuation', 'diff.plus', 'diff.minus'
];

if (family.name !== 'Emberveil' || family.author !== 'Mario Decker') {
  throw new Error('Unexpected theme-family metadata');
}
if (family.themes?.length !== expectedThemes.size) {
  throw new Error(`Expected ${expectedThemes.size} themes, found ${family.themes?.length ?? 0}`);
}

for (const theme of family.themes) {
  if (expectedThemes.get(theme.name) !== theme.appearance) {
    throw new Error(`${theme.name}: appearance does not match the expected family member`);
  }
  const missingStyle = requiredStyleKeys.filter((key) => !(key in theme.style));
  const missingSyntax = requiredSyntaxKeys.filter((key) => !(key in theme.style.syntax));
  if (missingStyle.length) throw new Error(`${theme.name}: missing style roles: ${missingStyle.join(', ')}`);
  if (missingSyntax.length) throw new Error(`${theme.name}: missing syntax roles: ${missingSyntax.join(', ')}`);

  for (const [key, value] of Object.entries(theme.style)) {
    if (key === 'syntax' || key === 'players' || key === 'accents' || key === 'background.appearance') continue;
    if (typeof value !== 'string' || !colorPattern.test(value)) {
      throw new Error(`${theme.name}: invalid color at style.${key}`);
    }
  }
  for (const [key, value] of Object.entries(theme.style.syntax)) {
    if (!value?.color || !colorPattern.test(value.color)) {
      throw new Error(`${theme.name}: invalid syntax color at ${key}`);
    }
  }
  for (const [index, color] of theme.style.accents.entries()) {
    if (!colorPattern.test(color)) throw new Error(`${theme.name}: invalid accent ${index}`);
  }
  for (const [index, player] of theme.style.players.entries()) {
    for (const [key, color] of Object.entries(player)) {
      if (!colorPattern.test(color)) throw new Error(`${theme.name}: invalid player ${index}.${key}`);
    }
  }

  const foreground = theme.style['editor.foreground'];
  if (theme.style.syntax.variable.color !== foreground || theme.style.syntax.property.color !== foreground) {
    throw new Error(`${theme.name}: variables and properties must remain neutral editor text`);
  }
  if (theme.style.syntax.keyword.color === theme.style.syntax.property.color) {
    throw new Error(`${theme.name}: keywords and data properties must remain semantically distinct`);
  }

  console.log(`${theme.name}: ${Object.keys(theme.style).length} UI roles, ${Object.keys(theme.style.syntax).length} syntax roles`);
}

if (process.argv[2]) {
  const schema = JSON.parse(await readFile(resolve(process.argv[2]), 'utf8'));
  const allowedStyleKeys = new Set(Object.keys(schema.definitions.ThemeStyleContent.properties));
  for (const theme of family.themes) {
    const unknown = Object.keys(theme.style).filter((key) => !allowedStyleKeys.has(key));
    if (unknown.length) throw new Error(`${theme.name}: keys outside the supplied Zed schema: ${unknown.join(', ')}`);
  }
  console.log(`Schema key check passed against ${resolve(process.argv[2])}`);
}

