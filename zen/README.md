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

## Test locally with `userChrome.css`

Until the Mod is published in Zen's Mods Registry, test it using an isolated profile or Zen's documented `userChrome.css` workflow:

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
