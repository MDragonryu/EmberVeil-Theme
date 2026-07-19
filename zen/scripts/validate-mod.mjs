import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [metadataText, preferencesText, css, preview] = await Promise.all([
  readFile(resolve(root, 'theme.json'), 'utf8'),
  readFile(resolve(root, 'preferences.json'), 'utf8'),
  readFile(resolve(root, 'chrome.css'), 'utf8'),
  readFile(resolve(root, 'preview.png'))
]);

const metadata = JSON.parse(metadataText);
const preferences = JSON.parse(preferencesText);
const requiredMetadata = ['id', 'name', 'description', 'homepage', 'style', 'readme', 'preferences', 'image', 'author', 'version'];
const requiredTokens = [
  '--ev-shell', '--ev-sidebar', '--ev-surface', '--ev-panel', '--ev-hover',
  '--ev-active', '--ev-border', '--ev-text', '--ev-muted', '--ev-focus',
  '--ev-accent', '--ev-action', '--ev-danger'
];
const requiredSelectors = [
  '#navigator-toolbox', '.tabbrowser-tab[visuallyselected]', '.urlbar-background',
  'menupopup::part(content)', '#sidebar-box', 'findbar', '.zen-glance-sidebar-container'
];

for (const key of requiredMetadata) {
  if (!metadata[key]) throw new Error(`theme.json is missing ${key}`);
}
if (metadata.name.length >= 25) throw new Error('Mod name must be shorter than 25 characters');
if (metadata.description.length >= 100) throw new Error('Mod description must be shorter than 100 characters');
if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(metadata.id)) {
  throw new Error('Mod id must be a version-4 UUID');
}
if (!Array.isArray(preferences) || preferences.length === 0) throw new Error('preferences.json must be a non-empty array');

const seenProperties = new Set();
for (const preference of preferences) {
  for (const key of ['property', 'label', 'type']) {
    if (!preference[key]) throw new Error(`Preference is missing ${key}`);
  }
  if (seenProperties.has(preference.property)) throw new Error(`Duplicate preference ${preference.property}`);
  seenProperties.add(preference.property);
  if (!['checkbox', 'dropdown', 'string'].includes(preference.type)) {
    throw new Error(`Unsupported preference type ${preference.type}`);
  }
  if (preference.type === 'dropdown') {
    const values = new Set((preference.options ?? []).map((option) => option.value));
    if (!values.size || !values.has(preference.defaultValue)) {
      throw new Error(`${preference.property}: dropdown default must be one of its options`);
    }
  }
  if (!css.includes(preference.property)) throw new Error(`${preference.property}: preference is never used by chrome.css`);
}

for (const token of requiredTokens) {
  if (!css.includes(token)) throw new Error(`chrome.css is missing family token ${token}`);
}
for (const selector of requiredSelectors) {
  if (!css.includes(selector)) throw new Error(`chrome.css is missing coverage for ${selector}`);
}
if (css.includes('@namespace')) {
  throw new Error('chrome.css must not set a legacy XUL namespace; it prevents tokens from reaching Zen’s HTML root');
}
for (const attribute of [
  'mod-emberveil-zen-appearance',
  'mod-emberveil-zen-focused_tab_accent',
  'mod-emberveil-zen-colorful_essentials'
]) {
  if (!css.includes(attribute)) throw new Error(`chrome.css is missing the Mods Registry attribute route for ${attribute}`);
}

const lightDarkCalls = [...css.matchAll(/light-dark\((#[0-9a-f]{6}|rgba?\([^)]*\)),\s*(#[0-9a-f]{6}|rgba?\([^)]*\))\)/gi)];
if (lightDarkCalls.length < 20) throw new Error('Expected comprehensive paired light/dark tokens');

const braceBalance = [...css].reduce((balance, character) => balance + (character === '{' ? 1 : character === '}' ? -1 : 0), 0);
if (braceBalance !== 0) throw new Error(`Unbalanced CSS braces: ${braceBalance}`);

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!preview.subarray(0, 8).equals(pngSignature)) throw new Error('preview.png is not a PNG file');
const previewWidth = preview.readUInt32BE(16);
const previewHeight = preview.readUInt32BE(20);
if (previewWidth !== 600 || previewHeight !== 400) {
  throw new Error(`preview.png must be 600x400, found ${previewWidth}x${previewHeight}`);
}

console.log(`${metadata.name} ${metadata.version}: ${css.split('\n').length} CSS lines, ${preferences.length} preferences, ${lightDarkCalls.length} paired color declarations, ${previewWidth}x${previewHeight} preview`);
