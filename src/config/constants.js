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
  heading: "For Aaru,",
  body: `Happy 25th birthday.

Happy Birthday, Aaru! I'm so so so so so happy that you're a part of my life and I'm so so so so so grateful for you. 
I'm gonna care for your forever. I know things have been rough lately and I'm sorry that it turned out that way but I promise you
That things will get better and things will turn out the way you want it. 
In the moment that you feel like giving up, I want you to remember that I'm always here for you and I will never leave your side.
In the moment that you feel like you're lost, I'm going to be there for you to guide you to the right path. 
I will always be there for you to support you and to love you.
And you always bring a smile to my face and I will always be grateful for that.
I hope nothing but good health, happiness, and success comes your way. 
I hope you have a wonderful birthday and I hope you have a wonderful year ahead. I wish I could be there to celebrate with you but I promise you that we will celebrate together soon.

Here's to another year as bright as that sunflower.`,
  signoff: "— with love, always",
};

export const PLAYER_EYE_HEIGHT = 1.65;
export const PLAYER_MOVE_SPEED = 3.6;
export const PLAYER_RUN_SPEED = 5.6;
export const INTERACT_DISTANCE = 3.2;
