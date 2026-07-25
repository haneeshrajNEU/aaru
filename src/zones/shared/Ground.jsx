import { getToonGradientMap } from "../../systems/toonGradient";

// Simple flat toon-shaded ground disc/rect shared by every outdoor zone.
// Pass a pre-loaded, already-tiled `map` texture (see textureUtils.tileTexture)
// for a real diffuse look instead of (or on top of) the flat `color`.
export default function Ground({ size = 60, color = "#bfe3a0", position = [0, 0, 0], map }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[size, 48]} />
      <meshToonMaterial color={map ? "#ffffff" : color} map={map} gradientMap={getToonGradientMap()} />
    </mesh>
  );
}
