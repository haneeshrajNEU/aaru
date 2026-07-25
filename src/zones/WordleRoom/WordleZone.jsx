import { useEffect, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useLevelStore } from "../../store/useLevelStore";
import { useGameStore } from "../../store/useGameStore";
import { useWordleStore } from "../../store/useWordleStore";
import { transitionToZone } from "../../systems/zoneTransition";
import { audioManager } from "../../systems/audioManager";
import { getToonGradientMap } from "../../systems/toonGradient";
import { registerInteractable } from "../../systems/interactables";
import { ITEMS } from "../../config/items";
import { pushItemToast } from "../../components/ToastStack";
import { PLAYER_NAME } from "../../config/constants";
import Ground from "../shared/Ground";
import Portal from "../shared/Portal";
import RewardBurst from "../shared/RewardBurst";
import Pedestal from "../shared/Pedestal";
import ArcadeShell from "./ArcadeShell";
import ArcadeFloor from "./ArcadeFloor";
import ArcadeCabinets from "./ArcadeCabinets";
import ArcadeGlow from "./ArcadeGlow";
import { tileTexture } from "../../systems/textureUtils";

const TERMINAL_POS = [0, 0, -5];
const REWARD_POS = [0, 1, -3];
const BRIDGE_END_Z = -34;
const PORTAL_POS = [0, 1.1, BRIDGE_END_Z + 2];
const ARCADE_BOUNDS = { minX: -7.3, maxX: 7.3, minZ: -8.3, maxZ: 5.7 };

function Terminal({ position }) {
  const gradientMap = getToonGradientMap();
  const screenMap = useTexture("/textures/arcade-cabinet-screen.png");
  const solvedFlag = useGameStore((s) => s.flags.wordleSolved);

  useEffect(
    () =>
      registerInteractable({
        getPosition: () => ({ x: position[0], y: position[1], z: position[2] }),
        label: solvedFlag ? "The puzzle is already solved" : "Solve the puzzle",
        radius: 2.4,
        onInteract: () => {
          if (solvedFlag) return;
          useWordleStore.getState().openBoard();
        },
      }),
    [position, solvedFlag]
  );

  return (
    <group position={position}>
      {/* cabinet body */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.1, 1.5, 0.8]} />
        <meshToonMaterial color="#2f3d5c" gradientMap={gradientMap} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 1.15, 0.41]}>
        <planeGeometry args={[0.8, 0.5]} />
        <meshBasicMaterial map={screenMap} toneMapped={false} />
      </mesh>
      {/* marquee */}
      <mesh position={[0, 1.65, 0.2]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[1.15, 0.32, 0.16]} />
        <meshToonMaterial color="#1c2338" gradientMap={gradientMap} emissive="#8ec9ff" emissiveIntensity={0.55} />
      </mesh>
      {/* control panel: joystick + buttons */}
      <mesh position={[-0.28, 0.92, 0.41]}>
        <cylinderGeometry args={[0.02, 0.02, 0.16, 6]} />
        <meshBasicMaterial color="#e0455a" />
      </mesh>
      <mesh position={[-0.28, 1.01, 0.41]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#e0455a" />
      </mesh>
      {[0.02, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.92, 0.41]}>
          <cylinderGeometry args={[0.03, 0.03, 0.03, 10]} />
          <meshBasicMaterial color={i === 0 ? "#4f8fd9" : "#e0b34f"} />
        </mesh>
      ))}
    </group>
  );
}

export default function WordleZone() {
  const flags = useGameStore((s) => s.flags);
  const setFlag = useGameStore((s) => s.setFlag);
  const addItem = useGameStore((s) => s.addItem);
  const setQuest = useGameStore((s) => s.setQuest);
  const setGuideTarget = useGameStore((s) => s.setGuideTarget);
  const solvedEphemeral = useWordleStore((s) => s.solved);
  const rewardGrantedRef = useRef(flags.wordleRewardGiven);
  const [burstKey, setBurstKey] = useState(0);
  const wallMap = useTexture("/textures/wall-plaster-purple.png", tileTexture(6, 1));

  useEffect(() => {
    useLevelStore.getState().setLevel({
      bounds: ARCADE_BOUNDS,
      colliders: [{ x: TERMINAL_POS[0], z: TERMINAL_POS[2], radius: 0.75 }],
      spawn: { x: 0, y: 0, z: 5, yaw: 0 },
    });
  }, []);

  // Solving the board (ephemeral) commits to the persisted flag once.
  useEffect(() => {
    if (solvedEphemeral && !flags.wordleSolved) {
      setFlag("wordleSolved", true);
    }
  }, [solvedEphemeral]);

  // Grant reward + open the bridge the moment the persisted flag flips.
  useEffect(() => {
    if (flags.wordleSolved && !rewardGrantedRef.current) {
      rewardGrantedRef.current = true;
      setBurstKey((k) => k + 1);
      setTimeout(() => {
        addItem("wordleLetters");
        addItem("finalKey");
        pushItemToast(ITEMS.wordleLetters);
        pushItemToast(ITEMS.finalKey);
        setFlag("wordleRewardGiven", true);
        setFlag("bridgeRevealed", true);
        audioManager.playZone("bridge");
      }, 500);
    }
  }, [flags.wordleSolved]);

  useEffect(() => {
    if (flags.bridgeRevealed) {
      useLevelStore.getState().updateBounds({ minX: -3, maxX: 3, minZ: BRIDGE_END_Z - 4, maxZ: 5.7 });
      setQuest(`Cross the bridge toward the vault, ${PLAYER_NAME}.`);
      setGuideTarget({ x: PORTAL_POS[0], y: PORTAL_POS[1], z: PORTAL_POS[2] });
    } else {
      setQuest(`Solve the puzzle, ${PLAYER_NAME}.`);
      setGuideTarget({ x: TERMINAL_POS[0], y: 1, z: TERMINAL_POS[2] });
    }
  }, [flags.bridgeRevealed]);

  const gradientMap = getToonGradientMap();

  return (
    <>
      <color attach="background" args={["#161a2e"]} />
      <fog attach="fog" args={["#161a2e", 12, 40]} />
      <ambientLight intensity={0.55} color="#c9d8ff" />
      <pointLight position={[0, 4, -4]} intensity={0.45} color="#8ec9ff" distance={16} />

      <Ground size={16} color="#2a3352" />
      <ArcadeShell bounds={ARCADE_BOUNDS} wallMap={wallMap} />
      <ArcadeFloor bounds={ARCADE_BOUNDS} />
      <ArcadeCabinets />
      <ArcadeGlow bounds={ARCADE_BOUNDS} />

      <Pedestal position={[-3, 0, 2]} color="#3a4568" />
      <Terminal position={TERMINAL_POS} />

      <RewardBurst trigger={burstKey > 0} position={REWARD_POS} color="#8ec9ff" />

      {flags.bridgeRevealed && (
        <>
          {/* bridge deck */}
          <mesh position={[0, 0.02, (TERMINAL_POS[2] + BRIDGE_END_Z) / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.2, Math.abs(BRIDGE_END_Z - TERMINAL_POS[2])]} />
            <meshToonMaterial color="#6b5a45" gradientMap={gradientMap} />
          </mesh>
          {/* distant glow the bridge leads toward */}
          <mesh position={[0, 2, BRIDGE_END_Z - 6]}>
            <sphereGeometry args={[1.4, 16, 16]} />
            <meshBasicMaterial color="#ffe28a" toneMapped={false} transparent opacity={0.55} />
          </mesh>
          <pointLight position={[0, 2, BRIDGE_END_Z - 6]} color="#ffe28a" intensity={0.6} distance={20} />

          <Portal
            position={PORTAL_POS}
            color="#ffd9a0"
            onEnter={() => {
              audioManager.play("portal");
              transitionToZone("vault", `Bring the sunflower back to life, ${PLAYER_NAME}.`);
            }}
          />
        </>
      )}
    </>
  );
}
