import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { getToonGradientMap } from "../../systems/toonGradient";
import Pedestal from "../shared/Pedestal";

// The pedestal + open book the final letter rests on, at the far end of
// the rainbow bridge. `LetterPickup` (the actual interactable) is rendered
// separately, hovering just above this.
export default function BookStand({ position }) {
  const gradientMap = getToonGradientMap();
  const baseMap = useTexture("/textures/book-pages-open.png");

  // One "open book" image split across both pages — clone so each half can
  // have its own UV offset without the two sharing (and fighting over) a
  // single texture instance.
  const leftMap = useMemo(() => {
    const t = baseMap.clone();
    t.needsUpdate = true;
    t.repeat.set(0.5, 1);
    t.offset.set(0, 0);
    return t;
  }, [baseMap]);
  const rightMap = useMemo(() => {
    const t = baseMap.clone();
    t.needsUpdate = true;
    t.repeat.set(0.5, 1);
    t.offset.set(0.5, 0);
    return t;
  }, [baseMap]);

  return (
    <Pedestal position={position} color="#e7ddcf">
      <group position={[0, 0.86, 0]} rotation={[-0.25, 0, 0]}>
        {/* left page */}
        <mesh position={[-0.16, 0, 0]} rotation={[0, 0.35, 0]}>
          <boxGeometry args={[0.32, 0.02, 0.24]} />
          <meshToonMaterial map={leftMap} gradientMap={gradientMap} />
        </mesh>
        {/* right page */}
        <mesh position={[0.16, 0, 0]} rotation={[0, -0.35, 0]}>
          <boxGeometry args={[0.32, 0.02, 0.24]} />
          <meshToonMaterial map={rightMap} gradientMap={gradientMap} />
        </mesh>
        {/* spine */}
        <mesh position={[0, -0.01, 0]}>
          <boxGeometry args={[0.04, 0.04, 0.24]} />
          <meshToonMaterial color="#8a4a3a" gradientMap={gradientMap} />
        </mesh>
      </group>
    </Pedestal>
  );
}
