import { create } from "zustand";
import { persist } from "zustand/middleware";

const SAVE_KEY = "aaru-bday-save-v1";

export const initialFlags = {
  introSeen: false,
  loreBookRead: false,
  dioramasFixed: [false, false, false, false],
  dioramaRewardGiven: false,
  drinkTried: false,
  bowlingPinsDown: false,
  haneeshDefeated: false,
  waterDropletsCollected: [false, false, false, false, false],
  barPortalOpen: false,
  wordleSolved: false,
  wordleRewardGiven: false,
  bridgeRevealed: false,
  vaultSlots: { dust: false, head: false, water: false },
  sunflowerBloomed: false,
  letterFound: false,
  letterRead: false,
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      currentZone: "meadow",
      // Bumped on every setZone call so ZoneManager's remount key changes
      // even when jumping to the same zone name twice in a row (e.g. two
      // different dev-tools checkpoints inside the same zone).
      zoneToken: 0,
      inventory: [],
      flags: { ...initialFlags },
      questText: `Explore the meadow, ${""}`,
      guideTarget: null,
      settings: {
        guideEnabled: true,
        musicVolume: 0.5,
        sfxVolume: 0.7,
      },
      transitioning: false,

      setZone: (zone) => set((state) => ({ currentZone: zone, zoneToken: state.zoneToken + 1 })),

      setTransitioning: (val) => set({ transitioning: val }),

      addItem: (id) =>
        set((state) =>
          state.inventory.includes(id)
            ? state
            : { inventory: [...state.inventory, id] }
        ),

      hasItem: (id) => get().inventory.includes(id),

      setFlag: (key, value) =>
        set((state) => ({ flags: { ...state.flags, [key]: value } })),

      setFlagPath: (key, index, value) =>
        set((state) => {
          const arr = [...(state.flags[key] || [])];
          arr[index] = value;
          return { flags: { ...state.flags, [key]: arr } };
        }),

      setVaultSlot: (slot, value) =>
        set((state) => ({
          flags: {
            ...state.flags,
            vaultSlots: { ...state.flags.vaultSlots, [slot]: value },
          },
        })),

      setQuest: (text) => set({ questText: text }),

      setGuideTarget: (pos) => set({ guideTarget: pos }),

      toggleGuide: () =>
        set((state) => ({
          settings: { ...state.settings, guideEnabled: !state.settings.guideEnabled },
        })),

      setVolume: (kind, value) =>
        set((state) => ({ settings: { ...state.settings, [kind]: value } })),
    }),
    {
      name: SAVE_KEY,
      partialize: (state) => ({
        currentZone: state.currentZone,
        inventory: state.inventory,
        flags: state.flags,
        questText: state.questText,
        settings: state.settings,
      }),
    }
  )
);
