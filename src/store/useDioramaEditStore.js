import { create } from "zustand";

// Ephemeral bridge between the HTML slider panel and the live 3D diorama
// preview it's editing. Not persisted — only the "fixed" boolean per
// diorama (in useGameStore.flags.dioramasFixed) survives a refresh.
export const useDioramaEditStore = create((set) => ({
  activeIndex: null,
  rotation: 0, // degrees, 0-360
  scale: 1,
  correctRotation: 0,
  correctScale: 1,
  onSolved: null,

  open: ({ index, rotation, scale, correctRotation, correctScale, onSolved }) =>
    set({ activeIndex: index, rotation, scale, correctRotation, correctScale, onSolved }),
  close: () => set({ activeIndex: null }),
  setRotation: (r) => set({ rotation: r }),
  setScale: (s) => set({ scale: s }),
}));

export function angularDistance(a, b) {
  const diff = Math.abs(a - b) % 360;
  return Math.min(diff, 360 - diff);
}
