import { Text } from "@react-three/drei";
import { getToonGradientMap } from "../../systems/toonGradient";

const LANE_Z = -3.3; // matches the lane strip / ball roll path, relative to `origin`
const LANE_LEN = 7.4;
const LANE_WIDTH = 1.5;
const GUTTER_WIDTH = 0.35;
const LANE_FAR_EDGE = LANE_Z - LANE_LEN / 2;
const LANE_NEAR_EDGE = LANE_Z + LANE_LEN / 2;

const ARROW_Z = -2;
const ARROW_XS = [-0.5, -0.25, 0, 0.25, 0.5];

// Cosmetic dressing laid under/around BowlingGame's pins and ball — gutters,
// a foul line + approach dots, down-lane arrows, a pit curtain, and an
// overhead pinsetter housing — so the lane reads as a real bowling lane
// instead of a bare wood strip. Rendered inside BowlingGame's `origin`
// group, so positions here share the same relative frame as PIN_POSITIONS.
export default function LaneDetails() {
  const gradientMap = getToonGradientMap();
  const gutterX = LANE_WIDTH / 2 + GUTTER_WIDTH / 2;

  return (
    <>
      {/* approach surface, player's side of the foul line */}
      <mesh position={[0, 0.01, LANE_NEAR_EDGE + 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LANE_WIDTH, 1.8]} />
        <meshToonMaterial color="#b89468" gradientMap={gradientMap} />
      </mesh>
      {/* approach dots */}
      {[0.6, 1.0, 1.4].map((d, i) => (
        <mesh key={i} position={[0, 0.02, LANE_NEAR_EDGE + d]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.05, 10]} />
          <meshBasicMaterial color="#3a2f2a" />
        </mesh>
      ))}

      {/* foul line */}
      <mesh position={[0, 0.02, LANE_NEAR_EDGE]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LANE_WIDTH, 0.06]} />
        <meshBasicMaterial color="#e0455a" />
      </mesh>

      {/* gutters */}
      <mesh position={[-gutterX, 0.005, LANE_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GUTTER_WIDTH, LANE_LEN]} />
        <meshToonMaterial color="#241c30" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[gutterX, 0.005, LANE_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GUTTER_WIDTH, LANE_LEN]} />
        <meshToonMaterial color="#241c30" gradientMap={gradientMap} />
      </mesh>

      {/* down-lane arrows */}
      {ARROW_XS.map((x, i) => (
        <mesh key={i} position={[x, 0.02, ARROW_Z]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
          <planeGeometry args={[0.09, 0.09]} />
          <meshBasicMaterial color="#3a2f2a" />
        </mesh>
      ))}

      {/* pit curtain behind the pin deck */}
      <mesh position={[0, 1.1, LANE_FAR_EDGE - 0.2]}>
        <boxGeometry args={[LANE_WIDTH + GUTTER_WIDTH * 2 + 0.2, 2.2, 0.1]} />
        <meshToonMaterial color="#140f22" gradientMap={gradientMap} />
      </mesh>

      {/* overhead pinsetter housing + scoreboard */}
      <group position={[0, 2.6, LANE_FAR_EDGE + 0.3]}>
        <mesh>
          <boxGeometry args={[LANE_WIDTH + GUTTER_WIDTH * 2 + 0.4, 0.9, 1]} />
          <meshToonMaterial color="#3c2f57" gradientMap={gradientMap} />
        </mesh>
        <mesh position={[0, -0.1, 0.51]}>
          <planeGeometry args={[1.1, 0.5]} />
          <meshBasicMaterial color="#0a2018" toneMapped={false} />
        </mesh>
        <Text position={[0, -0.1, 0.52]} fontSize={0.18} color="#8effc9" anchorX="center" anchorY="middle">
          LANE 1
        </Text>
        <pointLight position={[0, -0.6, 0.8]} color="#bfe3ff" intensity={0.35} distance={6} />
      </group>

      {/* overhead light strip along the lane */}
      <mesh position={[0, 3.6, LANE_Z]}>
        <boxGeometry args={[0.25, 0.08, LANE_LEN - 0.6]} />
        <meshToonMaterial color="#fff6d0" gradientMap={gradientMap} emissive="#fff2a0" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}
