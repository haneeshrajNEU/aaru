import { useEffect, useRef, useState } from "react";
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

const TERMINAL_POS = [0, 0, -5];
const REWARD_POS = [0, 1, -3];
const BRIDGE_END_Z = -34;
const PORTAL_POS = [0, 1.1, BRIDGE_END_Z + 2];

function Terminal({ position }) {
  const gradientMap = getToonGradientMap();
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
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 0.6]} />
        <meshToonMaterial color="#2f3d5c" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, 0.85, 0.31]}>
        <planeGeometry args={[0.7, 0.4]} />
        <meshBasicMaterial color="#8ec9ff" toneMapped={false} />
      </mesh>
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

  useEffect(() => {
    useLevelStore.getState().setLevel({
      bounds: { minX: -7.3, maxX: 7.3, minZ: -8.3, maxZ: 5.7 },
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
