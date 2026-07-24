import { create } from "zustand";

// Ephemeral UI state — never persisted, reset on every load.
export const useUIStore = create((set, get) => ({
  inventoryOpen: false,
  settingsOpen: false,
  pointerLocked: false,
  lockToken: 0,
  requestPointerLock: () => set((state) => ({ lockToken: state.lockToken + 1 })),

  tipsy: false,
  setTipsy: (v) => set({ tipsy: v }),

  photoMode: false,
  setPhotoMode: (v) => set({ photoMode: v }),

  letterOpen: false,
  openLetter: () => set({ letterOpen: true }),
  closeLetter: () => set({ letterOpen: false }),
  modal: null, // { title, body, onContinue }
  toasts: [], // { id, label, icon }
  prompt: null, // { label } shown near an interactable
  dialogue: null, // { speaker, lines: [], index, onDone }

  toggleInventory: () =>
    set((state) => ({ inventoryOpen: !state.inventoryOpen })),
  closeInventory: () => set({ inventoryOpen: false }),

  toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),

  setPointerLocked: (v) => set({ pointerLocked: v }),

  showModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),

  setPrompt: (prompt) => {
    const cur = get().prompt;
    if (cur?.label === prompt?.label) return;
    set({ prompt });
  },

  pushToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { id: Math.random().toString(36).slice(2), ...toast }],
    })),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  startDialogue: (speaker, lines, onDone) =>
    set({ dialogue: { speaker, lines, index: 0, onDone } }),
  advanceDialogue: () =>
    set((state) => {
      if (!state.dialogue) return {};
      const nextIndex = state.dialogue.index + 1;
      if (nextIndex >= state.dialogue.lines.length) {
        state.dialogue.onDone?.();
        return { dialogue: null };
      }
      return { dialogue: { ...state.dialogue, index: nextIndex } };
    }),
}));
