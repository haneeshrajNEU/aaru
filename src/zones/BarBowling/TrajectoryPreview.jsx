import { useMemo } from "react";
import * as THREE from "three";
import { useBowlingStore } from "../../store/useBowlingStore";
import { computeFinalX, ROLL_DISTANCE } from "./rollMath";

const DOTS = 9;
const COLD = new THREE.Color("#4ab8ff");
const HOT = new THREE.Color("#ff5a5a");

// A live preview of where a roll will land, driven directly by the aim +
// power sliders in BowlingAimUI — updates in real time as the player drags
// them, instead of leaving the player guessing blind. Color eases from
// cool blue (gentle) to hot red (full power).
export default function TrajectoryPreview() {
  const open = useBowlingStore((s) => s.open);
  const aim = useBowlingStore((s) => s.aim);
  const power = useBowlingStore((s) => s.power);

  const color = useMemo(() => COLD.clone().lerp(HOT, power), [power]);

  if (!open) return null;

  const finalX = computeFinalX(aim, power);

  return (
    <group>
      {Array.from({ length: DOTS }).map((_, i) => {
        const t = (i + 1) / DOTS;
        return (
          <mesh key={i} position={[finalX * t, 0.03, -ROLL_DISTANCE * t]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.035 + t * 0.02, 10]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.5 + t * 0.35} />
          </mesh>
        );
      })}
      {/* predicted landing spot */}
      <mesh position={[finalX, 0.03, -ROLL_DISTANCE]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.16, 20]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}
