import { getToonGradientMap } from "../../systems/toonGradient";

// Simple flat toon-shaded ground disc/rect shared by every outdoor zone.
export default function Ground({ size = 60, color = "#bfe3a0", position = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[size, 48]} />
      <meshToonMaterial color={color} gradientMap={getToonGradientMap()} />
    </mesh>
  );
}
