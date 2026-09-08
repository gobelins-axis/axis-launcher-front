# axis-launcher-front

Nuxt menu page loaded fullscreen by the Electron launcher on the Axis arcade cabinet
(`axis-launcher.netlify.app`). It runs inside the launcher window with node
integration on, receives inputs through axis-api, and selects games by sending the
`url:changed` IPC. See `../CLAUDE.md` for the ecosystem and shared contracts.

## Run

`npm install`, `npm run dev` (Nuxt 2), `npm run generate` for the static build deployed on Netlify.

## Design system source of truth

Other Axis surfaces (the launcher's calibration page, the hub) copy from here:

- `assets/styles/resources/_variables.scss`: black `#000`, `#1F1F1F`, white; font `'Darker Grotesque'`; base font-size `1vw`; `rem(px, 'large')` converts against a 2560 reference (1rem = 25.6px).
- `assets/styles/core/_fonts.scss`: Darker Grotesque from Google Fonts at 500/600/700/800 (Google mapping: 700 = Bold). Local TTFs exist in `static/fonts/darker-grotesque/`.
- `components/InputIndicator` + `components/Inputs`: button glyph (`assets/icons/input-a/x/i/s.svg`, rendered at intrinsic 42px, not sized in CSS) + label 700 at 32/43, 20px apart; indicators 30px apart; row 80px from bottom-right; inputs list comes from the `inputs` store and swaps with fade 0.1s out / 0.5s in.
- `components/GameTag`: white pill, 700 at 20/27, padding 3/12/5/12, 20px radius with a square bottom-left corner.
- `components/GameDetails`: title 800 at 128/115, description 700 at 36/49.
- Logo in `assets/icons/logo.svg`, placed top-right at 80px, 152.5×60px.

## Notes

- Opening the calibration tool from the menu is a one-liner: `require('electron').ipcRenderer.send('calibration:open')` (main process handles it).
- The launcher preload adds `is-axis-machine` on `<html>` when running on the cabinet.
