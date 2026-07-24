import { Text } from "@react-three/drei";
import { getToonGradientMap } from "../../systems/toonGradient";

// A simple stone-ish pedestal with an optional floating label — used for
// the lore book stand, diorama bases, and the vault item slots.
export default function Pedestal({ position = [0, 0, 0], color = "#e7ddcf", label, children }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.8, 12]} />
        <meshToonMaterial color={color} gradientMap={getToonGradientMap()} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.06, 12]} />
        <meshToonMaterial color="#fff8ea" gradientMap={getToonGradientMap()} />
      </mesh>
      {label && (
        <Text position={[0, 1.15, 0]} fontSize={0.16} color="#5a4636" anchorX="center" anchorY="middle" font={undefined}>
          {label}
        </Text>
      )}
      {children}
    </group>
  );
}
