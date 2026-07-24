import { create } from "zustand";

const DEFAULT_BOUNDS = { minX: -20, maxX: 20, minZ: -20, maxZ: 20 };

// Per-zone collision + spawn data. Each zone sets this on mount so the
// single persistent PlayerController always knows the current walkable area.
export const useLevelStore = create((set) => ({
  colliders: [], // { x, z, radius }
  bounds: DEFAULT_BOUNDS,
  spawn: { x: 0, y: 0, z: 6, yaw: Math.PI },
  spawnToken: 0, // bump to force the controller to re-snap to spawn

  setLevel: ({ colliders = [], bounds = DEFAULT_BOUNDS, spawn }) =>
    set((state) => ({
      colliders,
      bounds,
      spawn: spawn || state.spawn,
      spawnToken: state.spawnToken + 1,
    })),

  // Expand/adjust bounds or colliders mid-visit (e.g. a bridge reveals
  // further floor) without re-snapping the player back to spawn.
  updateBounds: (bounds, colliders) =>
    set((state) => ({
      bounds: bounds || state.bounds,
      colliders: colliders || state.colliders,
    })),
}));
