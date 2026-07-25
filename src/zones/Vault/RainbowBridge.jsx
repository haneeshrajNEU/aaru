import { getToonGradientMap } from "../../systems/toonGradient";

const RAINBOW = ["#ff5a5a", "#ff9f4a", "#ffe066", "#7ed957", "#4ab8ff", "#7a6aff", "#c76aff"];
const PLANK_LEN = 0.72;
const LANTERN_SPACING = 2;

// A long rainbow-plank walkway from the sunflower clearing back to the book
// stand holding the birthday letter, its far end trailing off past the
// walkable area and fading into the fog — the literal payoff for "a long
// rainbow bridge that extends out of the dome."
export default function RainbowBridge({ startZ = -9.6, endZ = -46, width = 1.6 }) {
  const gradientMap = getToonGradientMap();
  const length = startZ - endZ;
  const plankCount = Math.round(length / PLANK_LEN);
  const step = length / plankCount;

  const lanternCount = Math.floor(length / LANTERN_SPACING);

  return (
    <group>
      {Array.from({ length: plankCount }).map((_, i) => {
        const color = RAINBOW[i % RAINBOW.length];
        return (
          <mesh key={i} position={[0, 0.02, startZ - step * (i + 0.5)]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width, step - 0.03]} />
            <meshToonMaterial color={color} gradientMap={gradientMap} emissive={color} emissiveIntensity={0.3} />
          </mesh>
        );
      })}

      {/* little glowing lanterns lining both edges the whole way down */}
      {Array.from({ length: lanternCount }).map((_, i) =>
        [-1, 1].map((side) => (
          <mesh key={`${i}-${side}`} position={[side * (width / 2 + 0.2), 0.35, startZ - LANTERN_SPACING * (i + 0.5)]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshBasicMaterial color={RAINBOW[i % RAINBOW.length]} toneMapped={false} />
          </mesh>
        ))
      )}

      {/* a few warm lights spaced along the span instead of one straining to cover it all */}
      {Array.from({ length: Math.ceil(length / 7) }).map((_, i) => (
        <pointLight
          key={i}
          position={[0, 1.2, startZ - 3.5 - i * 7]}
          color="#ffe08a"
          intensity={0.35}
          distance={8}
        />
      ))}
    </group>
  );
}
