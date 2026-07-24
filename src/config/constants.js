// ---------------------------------------------------------------------------
// Editable game content. Nothing in here touches game logic — safe to tweak.
// ---------------------------------------------------------------------------

export const PLAYER_NAME = "Aarushi";

// The site shows a countdown and withholds the game until this moment.
// Currently set for July 29, 2026, 12:00 AM IST (IST is UTC+5:30, no DST,
// so that's 2026-07-28T18:30:00Z). Edit this string to change the unlock time.
export const LAUNCH_AT_ISO = "2026-07-28T18:30:00.000Z";

// Wordle target word (Zone 3). Must be exactly 5 letters, A-Z only.
// Swap this out for whatever word you'd like her to solve.
export const TARGET_WORD = "PENIS";

// Haneesh's little cutscene lines after the pins fall in Zone 2.
// Feel free to rewrite these — order is preserved, add/remove freely.
export const HANEESH_INTRO_LINES = [
  "*the last pin wobbles... and out steps a very confused-looking guy*",
  "Oh — who's THAT?!",
  "IT'S HANEESH.",
  "Wait, why was I inside a bowling pin?",
  "Anyway. You'll need my head for the vault. Standard procedure. Bowl at me.",
];

// Placeholder — Claude/whoever builds this can drop the real personalized
// birthday note in here. Supports plain text with blank lines for paragraphs.
export const BIRTHDAY_LETTER = {
  heading: "For Aarushi,",
  body: `Happy 25th birthday.

This little world was made just for you — every diorama, every bad pun,
every pin Haneesh had to take to the face. (This part of the message is a
placeholder — the real letter goes here.)

Here's to another year as bright as that sunflower.`,
  signoff: "— with love, always",
};

export const PLAYER_EYE_HEIGHT = 1.65;
export const PLAYER_MOVE_SPEED = 3.6;
export const PLAYER_RUN_SPEED = 5.6;
export const INTERACT_DISTANCE = 3.2;
