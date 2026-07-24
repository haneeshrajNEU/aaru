import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { useGameStore } from "../../store/useGameStore";
import { ITEMS } from "../../config/items";
import { pushItemToast } from "../../components/ToastStack";
import { audioManager } from "../../systems/audioManager";

// A small bobbing, spinning pickup that auto-collects on walk-over. Whether
// it's already been collected is the caller's job (pass `collected` from a
// persisted flag so it doesn't reappear after a refresh).
export default function Collectible({ position, itemId, color = "#8ec9ff", radius = 1.3, collected, onCollected }) {
  const { camera } = useThree();
  const ref = useRef();
  const firedRef = useRef(false);

  useFrame(({ clock }) => {
    if (collected || firedRef.current) return;
    if (ref.current) {
      ref.current.position.y = position[1] + 0.5 + Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.08;
      ref.current.rotation.y += 0.025;
    }
    const dx = camera.position.x - position[0];
    const dz = camera.position.z - position[2];
    if (Math.sqrt(dx * dx + dz * dz) < radius) {
      firedRef.current = true;
      useGameStore.getState().addItem(itemId);
      pushItemToast(ITEMS[itemId]);
      audioManager.play("pickup");
      onCollected?.();
    }
  });

  if (collected) return null;

  return (
    <mesh ref={ref} position={[position[0], position[1] + 0.5, position[2]]} frustumCulled={false}>
      <octahedronGeometry args={[0.14, 0]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}
