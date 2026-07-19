import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  assertReadableBuild,
  backupRegistry,
  modRoot,
  readRegistry,
  removeDevelopmentFiles,
  resolveProfile,
  writeRegistry
} from './profile-utils.mjs';

try {
  await assertReadableBuild();
  const profile = await resolveProfile(process.argv[2]);
  const manifest = JSON.parse(await readFile(join(modRoot, 'theme.json'), 'utf8'));
  const { registryPath, registry } = await readRegistry(profile);
  const backupPath = await backupRegistry(registryPath);
  const destination = await removeDevelopmentFiles(profile, manifest.id);

  delete registry[manifest.id];
  await writeRegistry(registryPath, registry);

  console.log(`Removed the ${manifest.name} development Mod.`);
  console.log(`Removed Mod directory: ${destination}`);
  if (backupPath) console.log(`Registry backup: ${backupPath}`);
  console.log('Open Zen again to rebuild its active Mods stylesheet.');
} catch (error) {
  console.error(`Emberveil development uninstall failed: ${error.message}`);
  process.exitCode = 1;
}

