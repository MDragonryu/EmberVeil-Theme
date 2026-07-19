import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chmod, copyFile, mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDirectory, '..');
const userHome = homedir();
const themeDirectory = join(userHome, '.config', 'ghostty', 'themes');
const configPath = join(userHome, 'Library', 'Application Support', 'com.mitchellh.ghostty', 'config');
const ghosttyBinary = '/Applications/Ghostty.app/Contents/MacOS/ghostty';
const themeNames = ['Emberveil Dark', 'Emberveil Light'];
const pairedThemeSetting = 'theme = dark:Emberveil Dark,light:Emberveil Light';

function timestamp() {
  return new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
}

async function copyWithBackup(source, destination) {
  let existing = null;
  try {
    existing = await readFile(destination);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const incoming = await readFile(source);
  if (existing?.equals(incoming)) return { changed: false, backup: null };

  let backup = null;
  if (existing) {
    backup = `${destination}.emberveil-backup-${timestamp()}`;
    await copyFile(destination, backup);
  }
  await copyFile(source, destination);
  return { changed: true, backup };
}

await mkdir(themeDirectory, { recursive: true });

for (const name of themeNames) {
  const result = await copyWithBackup(join(packageRoot, 'themes', name), join(themeDirectory, name));
  console.log(`${name}: ${result.changed ? 'installed' : 'already current'}`);
  if (result.backup) console.log(`Theme backup: ${result.backup}`);
}

const originalConfig = await readFile(configPath, 'utf8');
const activeThemePattern = /^[ \t]*theme[ \t]*=.*$/gm;
const activeThemeLines = originalConfig.match(activeThemePattern) ?? [];
if (activeThemeLines.length > 1) {
  throw new Error(`Refusing to choose between ${activeThemeLines.length} active theme settings in ${configPath}`);
}

let updatedConfig;
if (activeThemeLines.length === 1) {
  updatedConfig = originalConfig.replace(activeThemePattern, pairedThemeSetting);
} else {
  const separator = originalConfig.endsWith('\n') ? '\n' : '\n\n';
  updatedConfig = `${originalConfig}${separator}# Emberveil paired terminal themes.\n${pairedThemeSetting}\n`;
}

const temporaryConfig = `${configPath}.emberveil-write`;
const originalMode = (await stat(configPath)).mode;
await writeFile(temporaryConfig, updatedConfig, 'utf8');
await chmod(temporaryConfig, originalMode);

const validation = spawnSync(ghosttyBinary, ['+validate-config', `--config-file=${temporaryConfig}`], { encoding: 'utf8' });
if (validation.status !== 0) {
  throw new Error(`Ghostty rejected the staged configuration:\n${validation.stderr || validation.stdout}`);
}

if (updatedConfig !== originalConfig) {
  const backupPath = `${configPath}.emberveil-backup-${timestamp()}`;
  await copyFile(configPath, backupPath);
  await rename(temporaryConfig, configPath);
  console.log(`Config backup: ${backupPath}`);
  console.log(`Enabled: ${pairedThemeSetting}`);
} else {
  console.log('Ghostty configuration already enables the paired Emberveil themes.');
}

console.log('Ghostty configuration validation passed. Reload with Command+Shift+, or restart Ghostty.');

