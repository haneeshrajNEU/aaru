import { create } from "zustand";

// Ephemeral aim/power UI state, mirroring useDioramaEditStore's pattern:
// the HTML slider panel writes here, the 3D BowlingGame reads `rollToken`
// to know when to animate a roll. Both aim and power are plain sliders the
// player sets directly — no hidden timing mechanic — so the live 3D
// trajectory preview can show exactly what a roll will do.
export const useBowlingStore = create((set) => ({
  open: false,
  mode: null, // 'pins' | 'haneesh'
  aim: 0, // -1..1
  power: 0.6, // 0..1
  rollToken: 0,
  rollAim: 0,
  rollPower: 0,

  openAim: (mode) => set({ open: true, mode, aim: 0, power: 0.6 }),
  setAim: (aim) => set({ aim }),
  setPower: (power) => set({ power }),
  close: () => set({ open: false }),
  bowl: () =>
    set((s) => ({
      rollToken: s.rollToken + 1,
      rollAim: s.aim,
      rollPower: s.power,
      open: false,
    })),
}));
