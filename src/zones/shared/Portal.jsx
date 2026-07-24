import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { getToonGradientMap } from "../../systems/toonGradient";

// A glowing ring the player walks through to transition zones. Fires
// `onEnter` once when the camera gets close enough — no interact key needed.
export default function Portal({ position, onEnter, color = "#bfe3ff", radius = 1.3, triggerDistance = 1.5 }) {
  const ringRef = useRef();
  const triggered = useRef(false);
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.5;
      ringRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.4) * 0.2;
    }
    if (triggered.current || !onEnter) return;
    const dx = camera.position.x - position[0];
    const dz = camera.position.z - position[2];
    if (Math.sqrt(dx * dx + dz * dz) < triggerDistance) {
      triggered.current = true;
      onEnter();
    }
  });

  return (
    <group position={position}>
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.13, 12, 32]} />
        <meshToonMaterial color={color} gradientMap={getToonGradientMap()} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      <pointLight color={color} intensity={0.6} distance={6} />
    </group>
  );
}
