import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getToonGradientMap } from "../../systems/toonGradient";
import { registerInteractable } from "../../systems/interactables";
import { useBowlingStore } from "../../store/useBowlingStore";
import { audioManager } from "../../systems/audioManager";
import Pin from "./Pin";
import Haneesh from "./Haneesh";

const PIN_POSITIONS = [
  [-0.48, -6.6], [-0.16, -6.6], [0.16, -6.6], [0.48, -6.6],
  [-0.32, -6.3], [0, -6.3], [0.32, -6.3],
  [-0.16, -6.0], [0.16, -6.0],
  [0, -5.7],
];
const HANEESH_POS = [0, 0, -6.15];
const ROLL_MS = 1100;

export default function BowlingGame({ origin, bowlingPinsDown, haneeshDefeated, onPinsCleared, onHeadCollected }) {
  const gradientMap = getToonGradientMap();
  const [pinsDown, setPinsDown] = useState(() => PIN_POSITIONS.map(() => false));
  const [haneeshKnocked, setHaneeshKnocked] = useState(0);
  const [ballVisible, setBallVisible] = useState(false);
  const ballRef = useRef();
  const ballAnim = useRef(null);
  const clearedRef = useRef(bowlingPinsDown);
  const rollingRef = useRef(false);

  const mode = bowlingPinsDown ? "haneesh" : "pins";

  useEffect(() => {
    if (haneeshDefeated) return undefined;
    return registerInteractable({
      getPosition: () => ({ x: origin[0], y: origin[1], z: origin[2] }),
      label: mode === "haneesh" ? "Bowl at Haneesh" : "Bowl!",
      radius: 2.6,
      onInteract: () => {
        // Ignore taps while a roll/knockdown animation is still playing so
        // spamming "Bowl!" can't stomp the in-progress Haneesh fall.
        if (rollingRef.current) return;
        useBowlingStore.getState().openAim(mode);
      },
    });
  }, [origin, mode, haneeshDefeated]);

  useEffect(
    () =>
      useBowlingStore.subscribe((state, prev) => {
        if (state.rollToken === prev.rollToken) return;
        rollingRef.current = true;
        audioManager.play("pinHit");
        setBallVisible(true);
        const finalX = THREE.MathUtils.clamp(state.rollAim * 1.5 + (state.rollPower - 0.5) * 0.4, -0.9, 0.9);
        const knockRadius = 0.32 + state.rollPower * 0.6;
        ballAnim.current = { start: performance.now(), finalX, knockRadius };
      }),
    [mode]
  );

  useFrame(() => {
    if (!ballAnim.current || !ballRef.current) return;
    const { start, finalX } = ballAnim.current;
    const t = Math.min((performance.now() - start) / ROLL_MS, 1);
    const eased = 1 - Math.pow(1 - t, 2);
    ballRef.current.position.set(eased * finalX, 0.14, -eased * 6.6);
    ballRef.current.rotation.x -= 0.35;

    if (t >= 1) {
      resolveRoll(ballAnim.current.finalX, ballAnim.current.knockRadius);
      ballAnim.current = null;
      setBallVisible(false);
    }
  });

  const resolveRoll = (finalX, knockRadius) => {
    if (mode === "pins") {
      setPinsDown((prev) => {
        const next = prev.map((down, i) => down || Math.abs(PIN_POSITIONS[i][0] - finalX) < knockRadius);
        if (next.every(Boolean) && !clearedRef.current) {
          clearedRef.current = true;
          audioManager.play("correct");
          setTimeout(() => onPinsCleared?.(), 500);
        }
        return next;
      });
      rollingRef.current = false;
    } else if (mode === "haneesh") {
      if (Math.abs(HANEESH_POS[0] - finalX) < knockRadius) {
        setHaneeshKnocked((k) => k + 1);
        // stays "rolling" until Haneesh's fall+bounce finishes, see handleHaneeshDone
      } else {
        rollingRef.current = false;
      }
    }
  };

  const handleHaneeshDone = () => {
    rollingRef.current = false;
    onHeadCollected?.();
  };

  return (
    <group position={origin}>
      {mode === "pins" &&
        PIN_POSITIONS.map((p, i) => <Pin key={i} position={p} down={pinsDown[i]} />)}

      {mode === "haneesh" && !haneeshDefeated && (
        <Haneesh position={HANEESH_POS} knockedToken={haneeshKnocked} onDone={handleHaneeshDone} />
      )}

      {ballVisible && (
        <mesh ref={ballRef} position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshToonMaterial color="#3a2f45" gradientMap={gradientMap} />
        </mesh>
      )}
    </group>
  );
}
