import { getToonGradientMap } from "../../systems/toonGradient";
import Pedestal from "../shared/Pedestal";

// The pedestal + open book the final letter rests on, at the far end of
// the rainbow bridge. `LetterPickup` (the actual interactable) is rendered
// separately, hovering just above this.
export default function BookStand({ position }) {
  const gradientMap = getToonGradientMap();

  return (
    <Pedestal position={position} color="#e7ddcf">
      <group position={[0, 0.86, 0]} rotation={[-0.25, 0, 0]}>
        {/* left page */}
        <mesh position={[-0.16, 0, 0]} rotation={[0, 0.35, 0]}>
          <boxGeometry args={[0.32, 0.02, 0.24]} />
          <meshToonMaterial color="#fdf6e3" gradientMap={gradientMap} />
        </mesh>
        {/* right page */}
        <mesh position={[0.16, 0, 0]} rotation={[0, -0.35, 0]}>
          <boxGeometry args={[0.32, 0.02, 0.24]} />
          <meshToonMaterial color="#fdf6e3" gradientMap={gradientMap} />
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
