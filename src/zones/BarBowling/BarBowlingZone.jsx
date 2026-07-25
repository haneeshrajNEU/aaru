import { useEffect, useRef } from "react";
import { useLevelStore } from "../../store/useLevelStore";
import { useGameStore } from "../../store/useGameStore";
import { useUIStore } from "../../store/useUIStore";
import { transitionToZone } from "../../systems/zoneTransition";
import { audioManager } from "../../systems/audioManager";
import { getToonGradientMap } from "../../systems/toonGradient";
import { ITEMS } from "../../config/items";
import { pushItemToast } from "../../components/ToastStack";
import { PLAYER_NAME, HANEESH_INTRO_LINES } from "../../config/constants";
import Ground from "../shared/Ground";
import Portal from "../shared/Portal";
import Collectible from "../shared/Collectible";
import BarCounter from "./BarCounter";
import BowlingGame from "./BowlingGame";
import BowlingAlleyShell from "./BowlingAlleyShell";
import LoungeDecor from "./LoungeDecor";

const ROOM_BOUNDS = { minX: -9, maxX: 9, minZ: -6.8, maxZ: 6 };
const BAR_POS = [-6, 0, 2];
const LANE_ORIGIN = [4, 0, 3];
const DROPLET_POS = [
  [-2, 0, -1],
  [2.5, 0, -2],
  [-4.5, 0, -2.5],
  [1, 0, -3.5],
  [-6.5, 0, -1.5],
];
const PORTAL_POS = [0, 1.1, -5.2];

export default function BarBowlingZone() {
  const flags = useGameStore((s) => s.flags);
  const setFlag = useGameStore((s) => s.setFlag);
  const setFlagPath = useGameStore((s) => s.setFlagPath);
  const addItem = useGameStore((s) => s.addItem);
  const setQuest = useGameStore((s) => s.setQuest);
  const setGuideTarget = useGameStore((s) => s.setGuideTarget);
  const gradientMap = getToonGradientMap();
  const dialogueStarted = useRef(false);

  const allDropletsCollected = flags.waterDropletsCollected.every(Boolean);
  const canLeave = flags.haneeshDefeated && allDropletsCollected;

  useEffect(() => {
    useLevelStore.getState().setLevel({
      bounds: ROOM_BOUNDS,
      colliders: [{ x: BAR_POS[0], z: BAR_POS[2], radius: 1.1 }],
      spawn: { x: 0, y: 0, z: 5.5, yaw: 0 },
    });
  }, []);

  useEffect(() => {
    if (canLeave) {
      setQuest(`A portal has opened, ${PLAYER_NAME}.`);
      setGuideTarget({ x: PORTAL_POS[0], y: PORTAL_POS[1], z: PORTAL_POS[2] });
    } else if (flags.haneeshDefeated) {
      setQuest(`Collect the last water droplets, ${PLAYER_NAME}.`);
      const nextDroplet = DROPLET_POS.findIndex((_, i) => !flags.waterDropletsCollected[i]);
      if (nextDroplet >= 0) setGuideTarget({ x: DROPLET_POS[nextDroplet][0], y: 0.7, z: DROPLET_POS[nextDroplet][2] });
    } else if (flags.bowlingPinsDown) {
      setQuest(`Bowl at Haneesh to get his head, ${PLAYER_NAME}.`);
      setGuideTarget({ x: LANE_ORIGIN[0], y: 1, z: LANE_ORIGIN[2] });
    } else {
      setQuest(`Grab a drink, then clear the bowling lane, ${PLAYER_NAME}.`);
      setGuideTarget({ x: LANE_ORIGIN[0], y: 1, z: LANE_ORIGIN[2] });
    }
  }, [flags.bowlingPinsDown, flags.haneeshDefeated, canLeave]);

  const handlePinsCleared = () => {
    setFlag("bowlingPinsDown", true);
    if (!dialogueStarted.current) {
      dialogueStarted.current = true;
      useUIStore.getState().startDialogue("Haneesh", HANEESH_INTRO_LINES, () => {});
    }
  };

  const handleHeadCollected = () => {
    setFlag("haneeshDefeated", true);
    addItem("haneeshHead");
    pushItemToast(ITEMS.haneeshHead);
    audioManager.play("correct");
  };

  return (
    <>
      <color attach="background" args={["#241c38"]} />
      <fog attach="fog" args={["#241c38", 14, 34]} />
      <ambientLight intensity={0.6} color="#c9b8ff" />
      <pointLight position={BAR_POS} intensity={0.5} color="#ffb347" distance={9} />
      <pointLight position={[LANE_ORIGIN[0], 3, LANE_ORIGIN[2] - 3]} intensity={0.4} color="#bfe3ff" distance={12} />

      <Ground size={22} color="#3a2f52" />
      <BowlingAlleyShell bounds={ROOM_BOUNDS} />

      {/* lane strip */}
      <mesh position={[LANE_ORIGIN[0], 0.01, LANE_ORIGIN[2] - 3.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 7.4]} />
        <meshToonMaterial color="#caa876" gradientMap={gradientMap} />
      </mesh>

      <BarCounter position={BAR_POS} />
      <LoungeDecor barPosition={BAR_POS} />

      <BowlingGame
        origin={LANE_ORIGIN}
        bowlingPinsDown={flags.bowlingPinsDown}
        haneeshDefeated={flags.haneeshDefeated}
        onPinsCleared={handlePinsCleared}
        onHeadCollected={handleHeadCollected}
      />

      {DROPLET_POS.map((p, i) => (
        <Collectible
          key={i}
          position={p}
          itemId="waterDroplets"
          color="#8ec9ff"
          collected={flags.waterDropletsCollected[i]}
          onCollected={() => setFlagPath("waterDropletsCollected", i, true)}
        />
      ))}

      {canLeave && (
        <Portal
          position={PORTAL_POS}
          color="#c9a8ff"
          onEnter={() => {
            audioManager.play("portal");
            transitionToZone("wordle", `Solve the puzzle, ${PLAYER_NAME}.`);
          }}
        />
      )}
    </>
  );
}
