import { useEffect, useRef, useState } from "react";
import { useLevelStore } from "../../store/useLevelStore";
import { useGameStore } from "../../store/useGameStore";
import { useUIStore } from "../../store/useUIStore";
import { audioManager } from "../../systems/audioManager";
import { getToonGradientMap } from "../../systems/toonGradient";
import { PLAYER_NAME } from "../../config/constants";
import Ground from "../shared/Ground";
import Sunflower from "../shared/Sunflower";
import WiltedField from "../shared/WiltedField";
import VaultContainer from "./VaultContainer";
import LetterPickup from "./LetterPickup";

const SUNFLOWER_POS = [0, 0.2, -9];
const SLOTS = [
  {
    key: "dust",
    position: [-2.6, 0.2, -6.5],
    label: "Magic Dust & Music Disc",
    requiredItems: ["magicDust", "musicDisc"],
    missingHint: "This needs the Magic Dust and Music Disc.",
    color: "#ffd966",
  },
  {
    key: "head",
    position: [0, 0.2, -5.3],
    label: "Haneesh's Head",
    requiredItems: ["haneeshHead"],
    missingHint: "This one needs Haneesh's Head.",
    color: "#7aa8d9",
  },
  {
    key: "water",
    position: [2.6, 0.2, -6.5],
    label: "Water, Letters & Key",
    requiredItems: ["waterDroplets", "wordleLetters", "finalKey"],
    missingHint: "This needs the Water Droplets, Wordle Letters, and Final Key.",
    color: "#8ec9ff",
  },
];
const LETTER_POS = [3.6, 0, -7.6];

export default function VaultZone() {
  const flags = useGameStore((s) => s.flags);
  const setVaultSlot = useGameStore((s) => s.setVaultSlot);
  const setFlag = useGameStore((s) => s.setFlag);
  const setQuest = useGameStore((s) => s.setQuest);
  const setGuideTarget = useGameStore((s) => s.setGuideTarget);
  const gradientMap = getToonGradientMap();
  const bloomedRef = useRef(flags.sunflowerBloomed);
  const [letterRevealed, setLetterRevealed] = useState(flags.letterFound);
  const photoTimerRef = useRef(null);

  const allFilled = SLOTS.every((s) => flags.vaultSlots[s.key]);

  useEffect(() => {
    useLevelStore.getState().setLevel({
      bounds: { minX: -8, maxX: 8, minZ: -13, maxZ: 7 },
      colliders: [
        { x: SUNFLOWER_POS[0], z: SUNFLOWER_POS[2], radius: 0.8 },
        ...SLOTS.map((s) => ({ x: s.position[0], z: s.position[2], radius: 0.8 })),
      ],
      spawn: { x: 0, y: 0, z: 6, yaw: 0 },
    });
    audioManager.playZone("bridge");
  }, []);

  useEffect(() => {
    if (letterRevealed) {
      setQuest(`There's a letter waiting for you, ${PLAYER_NAME}.`);
      setGuideTarget({ x: LETTER_POS[0], y: 0.6, z: LETTER_POS[2] });
    } else if (allFilled) {
      setQuest(`Take it all in, ${PLAYER_NAME}.`);
      setGuideTarget(null);
    } else {
      setQuest(`Place what you've gathered into the vault, ${PLAYER_NAME}.`);
      const nextSlot = SLOTS.find((s) => !flags.vaultSlots[s.key]);
      if (nextSlot) setGuideTarget({ x: nextSlot.position[0], y: 1, z: nextSlot.position[2] });
    }
  }, [allFilled, letterRevealed, flags.vaultSlots]);

  useEffect(() => {
    if (allFilled && !bloomedRef.current) {
      bloomedRef.current = true;
      setTimeout(() => {
        setFlag("sunflowerBloomed", true);
        audioManager.play("bloom");
        audioManager.playZone("vault");
      }, 600);

      setTimeout(() => {
        useUIStore.getState().setPhotoMode(true);
        photoTimerRef.current = setTimeout(() => {
          useUIStore.getState().setPhotoMode(false);
        }, 7000);
      }, 3200);
    }
    return () => clearTimeout(photoTimerRef.current);
  }, [allFilled]);

  // Once photo mode has run its course, reveal the letter.
  const photoMode = useUIStore((s) => s.photoMode);
  const photoModeSeen = useRef(false);
  useEffect(() => {
    if (photoMode) photoModeSeen.current = true;
    else if (photoModeSeen.current && !letterRevealed) {
      setLetterRevealed(true);
    }
  }, [photoMode]);

  return (
    <>
      <color attach="background" args={["#ffe3b0"]} />
      <fog attach="fog" args={["#ffe3b0", 20, 46]} />
      <ambientLight intensity={1.0} color="#fff6e0" />
      <directionalLight position={[6, 14, -4]} intensity={1.35} color="#fff0c0" />
      <pointLight position={SUNFLOWER_POS} intensity={0.4} color="#ffd966" distance={14} />

      <Ground size={9} color="#b8a888" position={[0, -0.01, -6]} />
      <WiltedField center={SUNFLOWER_POS} radius={9} count={140} bloomed={flags.sunflowerBloomed} />

      {/* entry stub bridge for visual continuity from the previous zone */}
      <mesh position={[0, 0.02, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 7]} />
        <meshToonMaterial color="#8a6f52" gradientMap={gradientMap} />
      </mesh>

      <Sunflower position={SUNFLOWER_POS} bloomed={flags.sunflowerBloomed} scale={1.6} />

      {SLOTS.map((s) => (
        <VaultContainer
          key={s.key}
          position={s.position}
          label={s.label}
          requiredItems={s.requiredItems}
          missingHint={s.missingHint}
          filled={flags.vaultSlots[s.key]}
          color={s.color}
          onPlace={() => {
            setVaultSlot(s.key, true);
            audioManager.play("place");
          }}
        />
      ))}

      {letterRevealed && <LetterPickup position={LETTER_POS} />}
    </>
  );
}
