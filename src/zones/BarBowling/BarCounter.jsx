import { useEffect } from "react";
import { getToonGradientMap } from "../../systems/toonGradient";
import { registerInteractable } from "../../systems/interactables";
import { useUIStore } from "../../store/useUIStore";
import { useGameStore } from "../../store/useGameStore";
import { audioManager } from "../../systems/audioManager";

const TIPSY_MS = 5000;

export default function BarCounter({ position }) {
  const gradientMap = getToonGradientMap();

  useEffect(
    () =>
      registerInteractable({
        getPosition: () => ({ x: position[0], y: position[1], z: position[2] }),
        label: "Have a drink",
        radius: 2.2,
        onInteract: () => {
          useGameStore.getState().setFlag("drinkTried", true);
          audioManager.play("clink");
          useUIStore.getState().setTipsy(true);
          setTimeout(() => useUIStore.getState().setTipsy(false), TIPSY_MS);
        },
      }),
    [position]
  );

  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 1, 0.7]} />
        <meshToonMaterial color="#5a3a2a" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[1.7, 0.06, 0.8]} />
        <meshToonMaterial color="#c9a87a" gradientMap={gradientMap} />
      </mesh>
      {/* the drink */}
      <mesh position={[0, 1.15, 0.15]}>
        <cylinderGeometry args={[0.08, 0.06, 0.18, 10]} />
        <meshToonMaterial color="#ffb347" gradientMap={gradientMap} emissive="#ffb347" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}
