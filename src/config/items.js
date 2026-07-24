// Inventory item definitions — icon is a plain emoji so no art assets are needed.
export const ITEMS = {
  magicDust: {
    id: "magicDust",
    name: "Magic Dust",
    icon: "✨",
    flavor:
      "Fine, warm-gold dust shaken loose from a fixed diorama. Smells faintly like a stage light.",
  },
  musicDisc: {
    id: "musicDisc",
    name: "Music Disc",
    icon: "💿",
    flavor: "A little record that only wants to play one song. Tap it to spin it up.",
  },
  haneeshHead: {
    id: "haneeshHead",
    name: "Haneesh's Head",
    icon: "🗿",
    flavor: "Yes, it's really his head. No, don't ask how it came out of a bowling pin.",
  },
  waterDroplets: {
    id: "waterDroplets",
    name: "Water Droplets",
    icon: "💧",
    flavor: "Collected one careful drop at a time from around the bar. Somehow still cold.",
  },
  wordleLetters: {
    id: "wordleLetters",
    name: "Wordle Letters",
    icon: "🔤",
    flavor: "The five tiles from a puzzle solved fair and square. They hum faintly, pleased with themselves.",
  },
  finalKey: {
    id: "finalKey",
    name: "Final Key",
    icon: "🗝️",
    flavor: "Heavier than it looks. It knows exactly which door it opens.",
  },
};

export const ITEM_ORDER = [
  "magicDust",
  "musicDisc",
  "haneeshHead",
  "waterDroplets",
  "wordleLetters",
  "finalKey",
];
