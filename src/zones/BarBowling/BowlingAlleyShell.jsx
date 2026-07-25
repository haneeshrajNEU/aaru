import { Text } from "@react-three/drei";
import { getToonGradientMap } from "../../systems/toonGradient";

const WALL_HEIGHT = 4.2;
const WALL_COLOR = "#3c2f57";
const TRIM_COLOR = "#241c38";
const DOOR_HALF = 2;
const DOOR_LEAF_WIDTH = 1.85;
const DOOR_HEIGHT = 2.6;

function DoorLeaf({ x, hingeLeft }) {
  const gradientMap = getToonGradientMap();
  return (
    <group position={[x, DOOR_HEIGHT / 2, 0]}>
      {/* frame */}
      <mesh>
        <boxGeometry args={[DOOR_LEAF_WIDTH, DOOR_HEIGHT, 0.08]} />
        <meshToonMaterial color="#1c1626" gradientMap={gradientMap} />
      </mesh>
      {/* glass pane */}
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[DOOR_LEAF_WIDTH - 0.16, DOOR_HEIGHT - 0.16, 0.02]} />
        <meshPhysicalMaterial color="#8fd0e8" transparent opacity={0.35} roughness={0.1} />
      </mesh>
      {/* push handle, near the meeting edge */}
      <mesh position={[hingeLeft ? DOOR_LEAF_WIDTH / 2 - 0.18 : -DOOR_LEAF_WIDTH / 2 + 0.18, 0, 0.06]}>
        <cylinderGeometry args={[0.02, 0.02, 1.1, 8]} />
        <meshBasicMaterial color="#c9c9d4" />
      </mesh>
    </group>
  );
}

// The building shell for the bar/bowling zone — four walls and a ceiling,
// double doors set into a gap in the front wall, and a lit marquee above —
// so the alley reads as an enclosed indoor space instead of a lit patch of
// open ground.
export default function BowlingAlleyShell({ bounds, wallMap }) {
  const gradientMap = getToonGradientMap();
  const { minX, maxX, minZ, maxZ } = bounds;
  const width = maxX - minX + 0.3;
  const depth = maxZ - minZ + 0.3;
  const centerZ = (minZ + maxZ) / 2;
  const frontZ = maxZ + 0.15;

  const leftEdge = minX - 0.15;
  const rightEdge = maxX + 0.15;
  const leftDoorWidth = -DOOR_HALF - leftEdge;
  const rightDoorWidth = rightEdge - DOOR_HALF;

  return (
    <>
      {/* ceiling */}
      <mesh position={[0, WALL_HEIGHT, centerZ]}>
        <boxGeometry args={[width, 0.3, depth]} />
        <meshToonMaterial color={TRIM_COLOR} gradientMap={gradientMap} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, WALL_HEIGHT / 2, minZ - 0.15]}>
        <boxGeometry args={[width, WALL_HEIGHT, 0.3]} />
        <meshToonMaterial map={wallMap} color={wallMap ? "#ffffff" : WALL_COLOR} gradientMap={gradientMap} />
      </mesh>

      {/* side walls */}
      <mesh position={[leftEdge, WALL_HEIGHT / 2, centerZ]}>
        <boxGeometry args={[0.3, WALL_HEIGHT, depth]} />
        <meshToonMaterial map={wallMap} color={wallMap ? "#ffffff" : WALL_COLOR} gradientMap={gradientMap} />
      </mesh>
      <mesh position={[rightEdge, WALL_HEIGHT / 2, centerZ]}>
        <boxGeometry args={[0.3, WALL_HEIGHT, depth]} />
        <meshToonMaterial map={wallMap} color={wallMap ? "#ffffff" : WALL_COLOR} gradientMap={gradientMap} />
      </mesh>

      {/* front wall, split around the entrance */}
      <mesh position={[leftEdge + leftDoorWidth / 2, WALL_HEIGHT / 2, frontZ]}>
        <boxGeometry args={[leftDoorWidth, WALL_HEIGHT, 0.3]} />
        <meshToonMaterial map={wallMap} color={wallMap ? "#ffffff" : WALL_COLOR} gradientMap={gradientMap} />
      </mesh>
      <mesh position={[DOOR_HALF + rightDoorWidth / 2, WALL_HEIGHT / 2, frontZ]}>
        <boxGeometry args={[rightDoorWidth, WALL_HEIGHT, 0.3]} />
        <meshToonMaterial map={wallMap} color={wallMap ? "#ffffff" : WALL_COLOR} gradientMap={gradientMap} />
      </mesh>

      {/* double doors filling the entrance gap */}
      <group position={[0, 0, frontZ]}>
        <DoorLeaf x={-DOOR_HALF + DOOR_LEAF_WIDTH / 2} hingeLeft />
        <DoorLeaf x={DOOR_HALF - DOOR_LEAF_WIDTH / 2} />
      </group>

      {/* marquee over the entrance */}
      <group position={[0, WALL_HEIGHT - 0.55, frontZ]}>
        <mesh>
          <boxGeometry args={[DOOR_HALF * 2 + 0.6, 0.7, 0.15]} />
          <meshToonMaterial color="#1a1430" gradientMap={gradientMap} />
        </mesh>
        <Text position={[0, 0, 0.09]} fontSize={0.28} color="#ffd1e8" anchorX="center" anchorY="middle">
          COSMIC LANES
        </Text>
        <pointLight position={[0, -0.1, 0.6]} color="#ff8fd1" intensity={0.5} distance={5} />
      </group>
    </>
  );
}
