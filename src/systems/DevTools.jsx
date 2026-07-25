import { useEffect, useState } from "react";
import { useGameStore, initialFlags } from "../store/useGameStore";
import { transitionToZone } from "./zoneTransition";

const DIORAMA_DONE = {
  introSeen: true,
  dioramasFixed: [true, true, true, true],
  dioramaRewardGiven: true,
};
const BOWLING_DONE = {
  ...DIORAMA_DONE,
  bowlingPinsDown: true,
  haneeshDefeated: true,
  waterDropletsCollected: [true, true, true, true, true],
};
const WORDLE_DONE = {
  ...BOWLING_DONE,
  wordleSolved: true,
  wordleRewardGiven: true,
  bridgeRevealed: true,
};

const CHECKPOINTS = [
  { zone: "meadow", label: "Meadow — fresh start", flags: {}, inventory: [] },
  {
    zone: "diorama",
    label: "Diorama Room — start",
    flags: { introSeen: true },
    inventory: [],
  },
  {
    zone: "diorama",
    label: "Diorama Room — solved",
    flags: DIORAMA_DONE,
    inventory: ["musicDisc", "magicDust"],
  },
  {
    zone: "barBowling",
    label: "Bar & Bowling — start",
    flags: DIORAMA_DONE,
    inventory: ["musicDisc", "magicDust"],
  },
  {
    zone: "barBowling",
    label: "Bar & Bowling — Haneesh phase",
    flags: { ...DIORAMA_DONE, bowlingPinsDown: true },
    inventory: ["musicDisc", "magicDust"],
  },
  {
    zone: "barBowling",
    label: "Bar & Bowling — collecting droplets",
    flags: { ...DIORAMA_DONE, bowlingPinsDown: true, haneeshDefeated: true },
    inventory: ["musicDisc", "magicDust", "haneeshHead"],
  },
  {
    zone: "wordle",
    label: "Wordle Room — start",
    flags: BOWLING_DONE,
    inventory: ["musicDisc", "magicDust", "haneeshHead", "waterDroplets"],
  },
  {
    zone: "wordle",
    label: "Wordle Room — solved / bridge open",
    flags: WORDLE_DONE,
    inventory: ["musicDisc", "magicDust", "haneeshHead", "waterDroplets", "wordleLetters", "finalKey"],
  },
  {
    zone: "vault",
    label: "Vault — empty slots",
    flags: WORDLE_DONE,
    inventory: ["musicDisc", "magicDust", "haneeshHead", "waterDroplets", "wordleLetters", "finalKey"],
  },
  {
    zone: "vault",
    label: "Vault — finale (bloomed + letter)",
    flags: {
      ...WORDLE_DONE,
      loreBookRead: true,
      drinkTried: true,
      barPortalOpen: true,
      vaultSlots: { dust: true, head: true, water: true },
      sunflowerBloomed: true,
      letterFound: true,
      letterRead: true,
    },
    inventory: ["musicDisc", "magicDust", "haneeshHead", "waterDroplets", "wordleLetters", "finalKey"],
  },
];

function applyCheckpoint(cp) {
  useGameStore.setState({
    inventory: [...cp.inventory],
    flags: { ...initialFlags, ...cp.flags },
  });
  transitionToZone(cp.zone);
}

// Dev-only jump panel — toggle with the backtick/grave key — listing every
// major checkpoint in the game so any stage can be reached instantly for
// testing without replaying from the start. Only mounted in dev builds
// (gated in App.jsx); stripped out of production entirely.
export default function DevTools() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Backquote") {
        e.preventDefault();
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        background: "rgba(20, 16, 30, 0.92)",
        color: "#fffaf0",
        borderRadius: 12,
        padding: "14px 16px",
        fontFamily: "monospace",
        fontSize: 12,
        pointerEvents: "auto",
        maxWidth: 320,
      }}
    >
      <div style={{ marginBottom: 8, opacity: 0.7 }}>DEV — jump to stage (` to close)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {CHECKPOINTS.map((cp, i) => (
          <button
            key={i}
            onClick={() => {
              applyCheckpoint(cp);
              setVisible(false);
            }}
            style={{
              textAlign: "left",
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "#fffaf0",
              borderRadius: 6,
              padding: "6px 10px",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: 12,
            }}
          >
            {cp.label}
          </button>
        ))}
      </div>
    </div>
  );
}
