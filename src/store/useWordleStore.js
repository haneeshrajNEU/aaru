import { create } from "zustand";
import { TARGET_WORD } from "../config/constants";

const WORD_LEN = 5;

function evaluateGuess(guess, target) {
  const result = new Array(WORD_LEN).fill("absent");
  const targetArr = target.split("");
  const guessArr = guess.split("");
  const used = new Array(WORD_LEN).fill(false);

  for (let i = 0; i < WORD_LEN; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }
  for (let i = 0; i < WORD_LEN; i++) {
    if (result[i] === "correct") continue;
    const idx = targetArr.findIndex((c, j) => c === guessArr[i] && !used[j]);
    if (idx >= 0) {
      result[i] = "present";
      used[idx] = true;
    }
  }
  return result;
}

// Ephemeral Wordle state — resets per visit (not persisted), only the
// final `wordleSolved` flag in useGameStore survives a refresh. Unlimited
// guesses: the board just grows past the classic 6 rows instead of ending.
export const useWordleStore = create((set, get) => ({
  open: false,
  current: "",
  guesses: [], // { word, feedback }
  solved: false,

  openBoard: () => set({ open: true }),
  closeBoard: () => set({ open: false }),

  typeLetter: (ch) =>
    set((s) => (s.solved || s.current.length >= WORD_LEN ? s : { current: s.current + ch })),
  backspace: () => set((s) => (s.solved ? s : { current: s.current.slice(0, -1) })),

  submitGuess: () => {
    const s = get();
    if (s.solved || s.current.length !== WORD_LEN) return;
    const word = s.current.toUpperCase();
    const feedback = evaluateGuess(word, TARGET_WORD);
    const solved = word === TARGET_WORD;
    set({
      guesses: [...s.guesses, { word, feedback }],
      current: "",
      solved,
    });
    return solved;
  },

  letterStatuses: () => {
    const statuses = {};
    const rank = { absent: 0, present: 1, correct: 2 };
    for (const { word, feedback } of get().guesses) {
      for (let i = 0; i < word.length; i++) {
        const ch = word[i];
        const status = feedback[i];
        if (!statuses[ch] || rank[status] > rank[statuses[ch]]) statuses[ch] = status;
      }
    }
    return statuses;
  },
}));
