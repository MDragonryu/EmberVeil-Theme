import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = resolve(scriptDirectory, '../12.3/editor');
const registryRoot = 'HKEY_CURRENT_USER\\Software\\Embarcadero\\BDS\\23.0\\Editor\\Highlight\\Custom Themes';

const elementNames = [
  'Additional search match highlight',
  'Assembler',
  'Attribute Names',
  'Attribute Values',
  'Brace Highlight',
  'Character',
  'Code folding tree',
  'Comment',
  'Diff addition',
  'Diff deletion',
  'Diff move',
  'Disabled break',
  'Enabled break',
  'Error line',
  'Execution point',
  'Float',
  'Folded code',
  'Hex',
  'Hot Link',
  'Identifier',
  'Illegal Char',
  'Invalid break',
  'Line Highlight',
  'Line Number',
  'Marked block',
  'Modified line',
  'Number',
  'Octal',
  'Plain text',
  'Preprocessor',
  'Reserved word',
  'Right margin',
  'Scripts',
  'Search match',
  'String',
  'Symbol',
  'Sync edit background',
  'Sync edit highlight',
  'Tags',
  'Whitespace'
];

const palettes = {
  'Emberveil Dark': {
    base: '#242632',
    foreground: '#CCCAC2',
    strong: '#E3DED3',
    muted: '#727D8E',
    faint: '#5F6777',
    keyword: '#FF9F5B',
    string: '#B8D982',
    number: '#C8ABE6',
    type: '#73C7D6',
    tag: '#5CCFE6',
    attribute: '#F29E74',
    warning: '#FFD173',
    success: '#9FCF86',
    actionText: '#FFF3E3',
    line: '#2D3040',
    selection: '#3A465C',
    search: '#59431F',
    searchSecondary: '#47413C',
    brace: '#46536A',
    fold: '#303342',
    diffAdd: '#354239',
    diffDelete: '#453238',
    diffMove: '#313D49',
    disabled: '#3B3F4E',
    breakpoint: '#754048',
    error: '#4A2D36',
    execution: '#51462F',
    rightMargin: '#454A59',
    sync: '#303342',
    syncHighlight: '#46536A'
  },
  'Emberveil Light': {
    base: '#E4DED2',
    foreground: '#35383F',
    strong: '#22272D',
    muted: '#58616B',
    faint: '#8A837A',
    keyword: '#A44012',
    string: '#46661F',
    number: '#704C87',
    type: '#1C6570',
    tag: '#0E687B',
    attribute: '#914321',
    warning: '#875900',
    success: '#46661F',
    actionText: '#F7EDE0',
    line: '#D6CFC3',
    selection: '#C4D3D8',
    search: '#DCC69A',
    searchSecondary: '#D6C9AD',
    brace: '#B5C8CE',
    fold: '#D8D1C5',
    diffAdd: '#CCD0B6',
    diffDelete: '#DCC2BA',
    diffMove: '#C6D6D8',
    disabled: '#C3BBB0',
    breakpoint: '#A33B42',
    error: '#E2B8B7',
    execution: '#D9C993',
    rightMargin: '#B9B1A6',
    sync: '#DDD6CA',
    syncHighlight: '#C4D3D8'
  }
};

function style(foreground, background, { bold = false, italic = false, underline = false } = {}) {
  return { foreground, background, bold, italic, underline };
}

function buildTheme(palette) {
  return {
    'Additional search match highlight': style(palette.strong, palette.searchSecondary),
    'Assembler': style(palette.warning, palette.base),
    'Attribute Names': style(palette.attribute, palette.base),
    'Attribute Values': style(palette.string, palette.base),
    'Brace Highlight': style(palette.strong, palette.brace, { bold: true }),
    'Character': style(palette.string, palette.base),
    'Code folding tree': style(palette.faint, palette.base),
    'Comment': style(palette.muted, palette.base, { italic: true }),
    'Diff addition': style(palette.strong, palette.diffAdd),
    'Diff deletion': style(palette.strong, palette.diffDelete),
    'Diff move': style(palette.strong, palette.diffMove),
    'Disabled break': style(palette.muted, palette.disabled),
    'Enabled break': style(palette.actionText, palette.breakpoint, { bold: true }),
    'Error line': style(palette.strong, palette.error),
    'Execution point': style(palette.strong, palette.execution, { bold: true }),
    'Float': style(palette.number, palette.base),
    'Folded code': style(palette.muted, palette.fold, { italic: true }),
    'Hex': style(palette.number, palette.base),
    'Hot Link': style(palette.type, palette.base, { underline: true }),
    'Identifier': style(palette.foreground, palette.base),
    'Illegal Char': style(palette.strong, palette.error, { bold: true }),
    'Invalid break': style(palette.muted, palette.error),
    'Line Highlight': style(palette.foreground, palette.line),
    'Line Number': style(palette.faint, palette.base),
    'Marked block': style(palette.strong, palette.selection),
    'Modified line': style(palette.type, palette.success),
    'Number': style(palette.number, palette.base),
    'Octal': style(palette.number, palette.base),
    'Plain text': style(palette.foreground, palette.base),
    'Preprocessor': style(palette.tag, palette.base),
    'Reserved word': style(palette.keyword, palette.base, { bold: true }),
    'Right margin': style(palette.rightMargin, palette.base),
    'Scripts': style(palette.warning, palette.base),
    'Search match': style(palette.strong, palette.search),
    'String': style(palette.string, palette.base),
    'Symbol': style(palette.foreground, palette.base),
    'Sync edit background': style(palette.foreground, palette.sync),
    'Sync edit highlight': style(palette.strong, palette.syncHighlight, { bold: true }),
    'Tags': style(palette.tag, palette.base),
    'Whitespace': style(palette.faint, palette.base)
  };
}

function toTColor(hex) {
  const match = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i.exec(hex);
  if (!match) throw new Error(`Invalid RGB color: ${hex}`);
  const [, red, green, blue] = match;
  return `$00${blue}${green}${red}`.toUpperCase();
}

function registryBoolean(value) {
  return value ? 'True' : 'False';
}

function validateTheme(themeName, theme) {
  const names = Object.keys(theme);
  const missing = elementNames.filter((name) => !names.includes(name));
  const extra = names.filter((name) => !elementNames.includes(name));
  if (missing.length || extra.length) {
    throw new Error(`${themeName} element mismatch; missing=${missing.join(', ')} extra=${extra.join(', ')}`);
  }
  for (const name of elementNames) {
    toTColor(theme[name].foreground);
    toTColor(theme[name].background);
  }
}

function renderTheme(themeName, theme) {
  const lines = [`[${registryRoot}\\${themeName}]`, ''];
  for (const name of elementNames) {
    const value = theme[name];
    lines.push(
      `[${registryRoot}\\${themeName}\\${name}]`,
      '"Default Foreground"="False"',
      '"Default Background"="False"',
      `"Bold"="${registryBoolean(value.bold)}"`,
      `"Italic"="${registryBoolean(value.italic)}"`,
      `"Underline"="${registryBoolean(value.underline)}"`,
      `"Foreground Color New"="${toTColor(value.foreground)}"`,
      `"Background Color New"="${toTColor(value.background)}"`,
      ''
    );
  }
  return lines;
}

const themes = Object.fromEntries(
  Object.entries(palettes).map(([name, palette]) => [name, buildTheme(palette)])
);

for (const [name, theme] of Object.entries(themes)) validateTheme(name, theme);

const installLines = [
  'Windows Registry Editor Version 5.00',
  '',
  '; Emberveil editor-only Color SpeedSettings for RAD Studio 12.3 Athens (BDS 23.0).',
  '; This file does not modify the IDE Theme/VCL Style or select a scheme automatically.',
  '',
  `[${registryRoot}]`,
  ''
];
for (const [name, theme] of Object.entries(themes)) installLines.push(...renderTheme(name, theme));

const uninstallLines = [
  'Windows Registry Editor Version 5.00',
  '',
  '; Removes only the two Emberveil custom Code Editor schemes.',
  '',
  `[-${registryRoot}\\Emberveil Dark]`,
  '',
  `[-${registryRoot}\\Emberveil Light]`,
  ''
];

const installSource = `${installLines.join('\r\n')}\r\n`;
const uninstallSource = `${uninstallLines.join('\r\n')}\r\n`;

const themeSectionCount = (installSource.match(/\\Custom Themes\\Emberveil (?:Dark|Light)\\/g) ?? []).length;
if (themeSectionCount !== elementNames.length * 2) {
  throw new Error(`Expected ${elementNames.length * 2} element sections, found ${themeSectionCount}`);
}
if (installSource.includes('\\23.0\\Theme]') || installSource.includes('VCLStyle')) {
  throw new Error('Generated installer escaped the editor-only registry scope.');
}

await mkdir(outputDirectory, { recursive: true });
await writeFile(resolve(outputDirectory, 'install-emberveil-editor-themes.reg'), installSource, 'ascii');
await writeFile(resolve(outputDirectory, 'uninstall-emberveil-editor-themes.reg'), uninstallSource, 'ascii');

console.log(`Generated ${Object.keys(themes).length} RAD Studio 12.3 editor themes with ${elementNames.length} elements each.`);
console.log(`Registry scope: ${registryRoot}`);
