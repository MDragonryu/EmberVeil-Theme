import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  assertReadableBuild,
  backupRegistry,
  copyDevelopmentFiles,
  modRoot,
  readRegistry,
  resolveProfile,
  writeRegistry
} from './profile-utils.mjs';

try {
  await assertReadableBuild();
  const profile = await resolveProfile(process.argv[2]);
  const manifest = JSON.parse(await readFile(join(modRoot, 'theme.json'), 'utf8'));
  const { registryPath, registry } = await readRegistry(profile);
  const backupPath = await backupRegistry(registryPath);
  const destination = await copyDevelopmentFiles(profile, manifest.id);

  registry[manifest.id] = {
    ...manifest,
    enabled: true
  };
  await writeRegistry(registryPath, registry);

  console.log(`Installed ${manifest.name} ${manifest.version} as a development Mod.`);
  console.log(`Profile: ${profile}`);
  console.log(`Mod files: ${destination}`);
  if (backupPath) console.log(`Registry backup: ${backupPath}`);
  console.log('Open Zen, then go to Settings > Zen Mods to configure Emberveil.');
} catch (error) {
  console.error(`Emberveil development install failed: ${error.message}`);
  process.exitCode = 1;
}

