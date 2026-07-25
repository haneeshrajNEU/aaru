import { getToonGradientMap } from "../../systems/toonGradient";

const WALL_HEIGHT = 4;
const WALL_COLOR = "#241a3d";
const TRIM_COLOR = "#150f28";
// Wide enough to clear the bridge corridor's bounds even after
// `updateBounds` narrows the zone to minX/maxX -3/3 once solved.
const GAP_HALF = 3.2;

// The building shell for the arcade/puzzle room — three walls and a
// ceiling with a pink neon backlight strip, and a gap in the back wall
// wide enough for the bridge corridor to pass through once revealed.
export default function ArcadeShell({ bounds }) {
  const gradientMap = getToonGradientMap();
  const { minX, maxX, minZ, maxZ } = bounds;
  const width = maxX - minX + 0.3;
  const depth = maxZ - minZ + 0.3;
  const centerZ = (minZ + maxZ) / 2;
  const backZ = minZ - 0.15;

  const leftEdge = minX - 0.15;
  const rightEdge = maxX + 0.15;
  const leftSegWidth = -GAP_HALF - leftEdge;
  const rightSegWidth = rightEdge - GAP_HALF;

  return (
    <>
      {/* ceiling */}
      <mesh position={[0, WALL_HEIGHT, centerZ]}>
        <boxGeometry args={[width, 0.3, depth]} />
        <meshToonMaterial color={TRIM_COLOR} gradientMap={gradientMap} />
      </mesh>
      {/* neon backlight strip hanging just under the ceiling */}
      <mesh position={[0, WALL_HEIGHT - 0.18, centerZ]}>
        <boxGeometry args={[width - 1.2, 0.03, depth - 1.2]} />
        <meshBasicMaterial color="#ff2fb0" toneMapped={false} transparent opacity={0.45} />
      </mesh>
      <pointLight position={[0, WALL_HEIGHT - 0.4, centerZ]} color="#ff6ad5" intensity={0.35} distance={14} />

      {/* back wall, split for the bridge corridor */}
      {leftSegWidth > 0 && (
        <mesh position={[leftEdge + leftSegWidth / 2, WALL_HEIGHT / 2, backZ]}>
          <boxGeometry args={[leftSegWidth, WALL_HEIGHT, 0.3]} />
          <meshToonMaterial color={WALL_COLOR} gradientMap={gradientMap} />
        </mesh>
      )}
      {rightSegWidth > 0 && (
        <mesh position={[GAP_HALF + rightSegWidth / 2, WALL_HEIGHT / 2, backZ]}>
          <boxGeometry args={[rightSegWidth, WALL_HEIGHT, 0.3]} />
          <meshToonMaterial color={WALL_COLOR} gradientMap={gradientMap} />
        </mesh>
      )}

      {/* side walls */}
      <mesh position={[leftEdge, WALL_HEIGHT / 2, centerZ]}>
        <boxGeometry args={[0.3, WALL_HEIGHT, depth]} />
        <meshToonMaterial color={WALL_COLOR} gradientMap={gradientMap} />
      </mesh>
      <mesh position={[rightEdge, WALL_HEIGHT / 2, centerZ]}>
        <boxGeometry args={[0.3, WALL_HEIGHT, depth]} />
        <meshToonMaterial color={WALL_COLOR} gradientMap={gradientMap} />
      </mesh>
    </>
  );
}
