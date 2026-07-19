import { access, copyFile, mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const modRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export async function pathExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function resolveProfile(argument) {
  if (!argument) {
    throw new Error('Pass the Zen profile directory shown by about:support.');
  }

  const profile = resolve(argument);
  const compatibility = join(profile, 'compatibility.ini');
  if (!(await pathExists(compatibility))) {
    throw new Error(`${profile} does not look like a Zen profile: compatibility.ini is missing.`);
  }

  const lock = join(profile, '.parentlock');
  if (await pathExists(lock)) {
    throw new Error('This Zen profile appears to be open. Close every window using this profile and run the command again.');
  }

  return profile;
}

export async function readRegistry(profile) {
  const registryPath = join(profile, 'zen-themes.json');
  if (!(await pathExists(registryPath))) return { registryPath, registry: {} };

  const source = await readFile(registryPath, 'utf8');
  const registry = JSON.parse(source);
  if (!registry || Array.isArray(registry) || typeof registry !== 'object') {
    throw new Error('zen-themes.json does not contain a Mod registry object.');
  }
  return { registryPath, registry };
}

export async function backupRegistry(registryPath) {
  if (!(await pathExists(registryPath))) return null;
  const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
  const backupPath = `${registryPath}.emberveil-backup-${timestamp}`;
  await copyFile(registryPath, backupPath);
  return backupPath;
}

export async function writeRegistry(registryPath, registry) {
  await mkdir(dirname(registryPath), { recursive: true });
  const temporaryPath = `${registryPath}.emberveil-write`;
  await writeFile(temporaryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, registryPath);
}

export async function copyDevelopmentFiles(profile, modId) {
  const destination = join(profile, 'chrome', 'zen-themes', modId);
  await mkdir(destination, { recursive: true });
  await Promise.all([
    copyFile(join(modRoot, 'chrome.css'), join(destination, 'chrome.css')),
    copyFile(join(modRoot, 'preferences.json'), join(destination, 'preferences.json')),
    copyFile(join(modRoot, 'README.md'), join(destination, 'readme.md'))
  ]);
  return destination;
}

export async function removeDevelopmentFiles(profile, modId) {
  const destination = join(profile, 'chrome', 'zen-themes', modId);
  await rm(destination, { recursive: true, force: true });
  return destination;
}

export async function assertReadableBuild() {
  for (const name of ['chrome.css', 'preferences.json', 'README.md', 'theme.json']) {
    await stat(join(modRoot, name));
  }
}

