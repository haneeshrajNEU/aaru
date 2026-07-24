import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getToonGradientMap } from "../../systems/toonGradient";

export default function Pin({ position, down }) {
  const groupRef = useRef();
  const gradientMap = getToonGradientMap();
  const fallDir = useRef(position[0] >= 0 ? 1 : -1);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const k = Math.min(delta * 6, 1);
    const targetRot = down ? (Math.PI / 2.1) * fallDir.current : 0;
    const targetY = down ? -0.16 : 0;
    groupRef.current.rotation.z += (targetRot - groupRef.current.rotation.z) * k;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * k;
  });

  return (
    <group ref={groupRef} position={[position[0], 0, position[1]]}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.11, 0.16, 0.36, 10]} />
        <meshToonMaterial color="#fff8ee" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshToonMaterial color="#fff8ee" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.018, 6, 16]} />
        <meshBasicMaterial color="#e0455a" />
      </mesh>
    </group>
  );
}
