import { useEffect } from "react";
import { Text } from "@react-three/drei";
import { getToonGradientMap } from "../../systems/toonGradient";
import { registerInteractable } from "../../systems/interactables";
import { useGameStore } from "../../store/useGameStore";
import { useUIStore } from "../../store/useUIStore";

// One of the three vault pedestals. Registers an interactable that only
// succeeds once the player holds everything in `requiredItems` — otherwise
// a gentle toast nudges her toward what's still missing.
export default function VaultContainer({ position, label, requiredItems, missingHint, filled, color, onPlace }) {
  const gradientMap = getToonGradientMap();

  useEffect(() => {
    if (filled) return undefined;
    return registerInteractable({
      getPosition: () => ({ x: position[0], y: position[1], z: position[2] }),
      label: `Place ${label}`,
      radius: 2.4,
      onInteract: () => {
        const inventory = useGameStore.getState().inventory;
        const hasAll = requiredItems.every((id) => inventory.includes(id));
        if (hasAll) {
          onPlace?.();
        } else {
          useUIStore.getState().pushToast({ icon: "❓", label: missingHint });
        }
      },
    });
  }, [position, label, requiredItems, filled, missingHint, onPlace]);

  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 0.7, 14]} />
        <meshToonMaterial color="#8a7a9a" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshToonMaterial
          color={filled ? color : "#4a3f54"}
          gradientMap={gradientMap}
          emissive={filled ? color : "#000000"}
          emissiveIntensity={filled ? 0.35 : 0}
        />
      </mesh>
      <Text position={[0, 1.25, 0]} fontSize={0.16} color="#d8cdf0" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}
