# Emberveil for Zen Browser

Emberveil for Zen is a color-focused Zen Mod containing both members of the theme family:

- **Emberveil Dark** uses smoky charcoal and slate surfaces rather than black.
- **Emberveil Light** uses dim paper and parchment surfaces rather than bright white.

The mod changes browser chrome—not websites—and deliberately keeps Zen's layout and interaction model intact. Tabs, folders, workspaces, the URL bar, autocomplete, menus, extension panels, downloads, side panels, the find bar, Glance, notifications, and private windows share Emberveil's surface and state language.

## Appearance options

The Mod settings expose three appearance modes:

- **Follow system / Zen** uses the appearance currently selected by Zen or the operating system.
- **Emberveil Dark** forces the dark family member.
- **Emberveil Light** forces the paper-light family member.

The active-tab amber edge can be disabled. Zen's colorful favicon backgrounds for Essential tabs can also be restored independently; they are restrained by default so Essentials remain part of the Emberveil hierarchy.

## Install directly as a development Mod

Zen's **Import Mods** button cannot import an unpublished local Mod. It reads a Mod-export JSON, takes each registered Mod ID, and downloads that ID from Zen's official Mods Registry. Local CSS paths in the import file are not used.

The included development installer registers Emberveil directly in the selected Zen profile using Zen's own Mod storage layout. This makes Emberveil appear under **Settings → Zen Mods**, including its normal Configure panel and appearance preferences, without editing `userChrome.css`.

1. In the profile you want to use, open `about:support` and find **Profile Folder**.
2. Close every Zen window using that profile.
3. From this `zen` directory, run:

```sh
node scripts/install-dev.mjs "/absolute/path/to/your/profile"
```

4. Reopen Zen and go to **Settings → Zen Mods → Emberveil**.

Running the installer again refreshes the development Mod after CSS changes. Before changing `zen-themes.json`, the installer creates a timestamped backup beside it. It refuses to operate while the selected profile is open or when the directory does not look like a Zen profile.

To remove the development installation cleanly:

```sh
node scripts/uninstall-dev.mjs "/absolute/path/to/your/profile"
```

The uninstaller also backs up the registry before removing only Emberveil's own Mod directory and registry entry.

## Alternative: test with `userChrome.css`

The development Mod installer above is preferred. Zen's documented `userChrome.css` workflow remains available as a lower-level alternative:

1. Open `about:support` in Zen and choose **Open Profile Folder**.
2. Create a `chrome` directory if it does not exist.
3. Copy `chrome.css` to `chrome/userChrome.css`.
4. In `about:config`, set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.
5. Restart Zen.

For a normal `userChrome.css` test, the Mod preference UI and its generated chrome attributes are not present. The stylesheet therefore follows Zen's current light/dark appearance. Use Zen's appearance setting when testing the raw stylesheet; the explicit System, Dark, and Light dropdown becomes available after installation as a Mod.

The active-tab accent and restrained Essential-tab treatment are also published Mod preferences. The raw stylesheet keeps the restrained Essential treatment and otherwise follows its base defaults.

## Validate

```sh
node scripts/validate-mod.mjs
```

`theme.json` is development metadata mirroring the Mods Registry record. The registry submission workflow ultimately generates its hosted URLs and requires a real 600×400 screenshot.

## Compatibility

The initial implementation targets Zen `1.19.6b` and uses its current browser-chrome variables. Accessibility modes remain authoritative: forced colors override Emberveil's palette, and reduced-motion preferences disable the one color transition introduced by this mod.
