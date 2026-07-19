import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const colorPattern = /^#[0-9a-f]{6}([0-9a-f]{2})?$/i;
const requiredWorkbenchColors = [
  'editor.background',
  'editor.foreground',
  'editor.selectionBackground',
  'editor.lineHighlightBackground',
  'sideBar.background',
  'activityBar.background',
  'statusBar.background',
  'terminal.background',
  'terminal.foreground'
];
const requiredSemanticTokens = [
  'keyword', 'function', 'method', 'type', 'class', 'interface', 'string',
  'number', 'property', 'comment', 'variable', 'parameter', 'operator'
];

for (const contribution of manifest.contributes?.themes ?? []) {
  const path = resolve(root, contribution.path);
  const theme = JSON.parse(await readFile(path, 'utf8'));
  const missingColors = requiredWorkbenchColors.filter((key) => !theme.colors?.[key]);
  const missingTokens = requiredSemanticTokens.filter((key) => !theme.semanticTokenColors?.[key]);
  const invalidColors = [];

  for (const [key, value] of Object.entries(theme.colors ?? {})) {
    if (typeof value !== 'string' || !colorPattern.test(value)) invalidColors.push(`colors.${key}`);
  }
  for (const [key, value] of Object.entries(theme.semanticTokenColors ?? {})) {
    const foreground = typeof value === 'string' ? value : value?.foreground;
    if (foreground && !colorPattern.test(foreground)) invalidColors.push(`semanticTokenColors.${key}`);
  }
  for (const [index, rule] of (theme.tokenColors ?? []).entries()) {
    const foreground = rule.settings?.foreground;
    const background = rule.settings?.background;
    if (foreground && !colorPattern.test(foreground)) invalidColors.push(`tokenColors[${index}].foreground`);
    if (background && !colorPattern.test(background)) invalidColors.push(`tokenColors[${index}].background`);
  }

  if (theme.semanticHighlighting !== true) throw new Error(`${contribution.label}: semantic highlighting is not enabled`);
  if (missingColors.length) throw new Error(`${contribution.label}: missing workbench colors: ${missingColors.join(', ')}`);
  if (missingTokens.length) throw new Error(`${contribution.label}: missing semantic tokens: ${missingTokens.join(', ')}`);
  if (invalidColors.length) throw new Error(`${contribution.label}: invalid color values: ${invalidColors.join(', ')}`);
  if ((theme.tokenColors ?? []).length < 20) throw new Error(`${contribution.label}: TextMate scope coverage is too small`);

  console.log(`${contribution.label}: ${Object.keys(theme.colors).length} workbench colors, ${theme.tokenColors.length} TextMate rules, ${Object.keys(theme.semanticTokenColors).length} semantic rules`);
}
