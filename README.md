# Sunflower — a birthday game for Aarushi

A small first-person browser game built as a birthday gift. Runs entirely
client-side — no login, no backend, just a link.

Walk through four zones collecting what the last sunflower needs to bloom
again: fix a room of tiny K-pop dioramas, survive a bar and a bowling alley
(and a guy named Hannesh), solve a Wordle puzzle, then bring it all to the
vault.

## Tech stack

- Vite + React
- React Three Fiber / drei / postprocessing (Three.js) for the 3D world
- Zustand for game state, with `persist` middleware handling the
  localStorage save automatically on every change
- Howler.js for audio (see "Adding audio" below — it works with zero audio
  files too)

## Running it

```bash
npm install
npm run dev
```

Open the printed `localhost` URL, click into the window, and play. WASD to
move, mouse to look, **E** to interact, **I** or **Tab** for the satchel
(inventory), Esc to back out of a panel.

## Building for deployment

```bash
npm run build
```

Output goes to `dist/` — drag that folder onto Netlify, or point Vercel at
this repo (framework preset: Vite, no environment variables needed) and it
just works. `npm run preview` serves the built output locally if you want
to sanity-check it first.

## What you can safely edit

Everything gameplay-specific that isn't code lives in `src/config/constants.js`:

- `PLAYER_NAME` — used throughout dialogue/UI (currently "Aarushi")
- `TARGET_WORD` — the Wordle answer (Zone 3). Must be exactly 5 letters.
- `HANNESH_INTRO_LINES` — the dialogue array for Hannesh's entrance in the
  bowling alley
- `BIRTHDAY_LETTER` — the heading/body/signoff for the final note. This is
  the one thing in the whole project you'll definitely want to replace
  before sending the link.

Item flavor text lives in `src/config/items.js` if you want to tweak the
satchel tooltips.

## Adding audio (optional)

The game ships fully playable with **no audio files** — Howler just stays
silent if a track is missing, no errors, no broken UI. If you want music
and sound, drop files into `public/audio/` using these exact names:

Zone loops (looping, crossfade automatically on zone change):
`meadow.mp3`, `diorama.mp3`, `bar.mp3`, `wordle.mp3`, `bridge.mp3`, `vault.mp3`

One-shot sound effects:
`sfx_pickup.mp3`, `sfx_place.mp3`, `sfx_portal.mp3`, `sfx_pin_hit.mp3`,
`sfx_correct.mp3`, `sfx_wrong.mp3`, `sfx_clink.mp3`, `sfx_bloom.mp3`

The music disc item (played from the satchel): `music_disc.mp3`

## Project structure

```
src/
  config/     TARGET_WORD, BIRTHDAY_LETTER, item text — edit freely
  store/      Zustand stores (persisted game state + several ephemeral
              per-mechanic UI stores: diorama editor, bowling aim, wordle)
  systems/    player controller, audio manager, guide firefly trail,
              bloom post-processing, zone-transition fade
  components/ HUD overlays — modal, inventory, quest tracker, dialogue box
  zones/      one folder per zone (Meadow, DioramaRoom, BarBowling,
              WordleRoom, Vault) plus zones/shared for reused 3D pieces
              (Sunflower, WiltedField, Portal, Pedestal, Collectible)
```

Progress autosaves after every pickup, placement, and zone transition —
refreshing mid-game resumes exactly where you left off.
