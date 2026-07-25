import { useTexture } from "@react-three/drei";
import { getToonGradientMap } from "../../systems/toonGradient";
import { tileTexture } from "../../systems/textureUtils";

const MARQUEE_COLORS = ["#ff6ad5", "#6affe8", "#ffe86a", "#8a6aff"];

function Cabinet({ position, rotationY, variant = 0, screenMap }) {
  const gradientMap = getToonGradientMap();
  const marquee = MARQUEE_COLORS[variant % MARQUEE_COLORS.length];

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* cabinet body */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.7, 1.4, 0.7]} />
        <meshToonMaterial color="#2a2438" gradientMap={gradientMap} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 1.15, 0.36]}>
        <planeGeometry args={[0.5, 0.4]} />
        <meshBasicMaterial map={screenMap} toneMapped={false} />
      </mesh>
      {/* marquee */}
      <mesh position={[0, 1.52, 0.18]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.72, 0.28, 0.14]} />
        <meshToonMaterial color="#1c1730" gradientMap={gradientMap} emissive={marquee} emissiveIntensity={0.55} />
      </mesh>
      {/* control panel: joystick + buttons */}
      <mesh position={[-0.15, 0.85, 0.36]}>
        <cylinderGeometry args={[0.015, 0.015, 0.14, 6]} />
        <meshBasicMaterial color="#e0455a" />
      </mesh>
      <mesh position={[-0.15, 0.93, 0.36]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#e0455a" />
      </mesh>
      {[0.05, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.85, 0.36]}>
          <cylinderGeometry args={[0.025, 0.025, 0.03, 10]} />
          <meshBasicMaterial color={i === 0 ? "#4f8fd9" : "#e0b34f"} />
        </mesh>
      ))}
    </group>
  );
}

function ClawMachine({ position, plushMap }) {
  const gradientMap = getToonGradientMap();

  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.9, 1.8, 0.9]} />
        <meshToonMaterial color="#e8455a" gradientMap={gradientMap} />
      </mesh>
      {/* glass front */}
      <mesh position={[0, 0.9, 0.46]}>
        <boxGeometry args={[0.75, 1.1, 0.02]} />
        <meshPhysicalMaterial color="#bfe3ff" transparent opacity={0.25} roughness={0.05} />
      </mesh>
      {/* plush pile */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[(i - 1.5) * 0.16, 0.45, 0.1]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshToonMaterial map={plushMap} gradientMap={gradientMap} />
        </mesh>
      ))}
      {/* marquee */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[0.9, 0.2, 0.3]} />
        <meshToonMaterial color="#fff2a0" gradientMap={gradientMap} emissive="#fff2a0" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function PrizeCounter({ position }) {
  const gradientMap = getToonGradientMap();
  const prizeColors = ["#ff9fc7", "#9fd8ff", "#ffe08a"];

  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 1, 0.6]} />
        <meshToonMaterial color="#3a2f57" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[1.9, 0.06, 0.7]} />
        <meshToonMaterial color="#c9a87a" gradientMap={gradientMap} />
      </mesh>
      {/* ticket spool */}
      <mesh position={[0.6, 1.15, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
        <meshBasicMaterial color="#fff2c9" />
      </mesh>
      {/* prizes on the counter */}
      {prizeColors.map((c, i) => (
        <mesh key={i} position={[-0.6 + i * 0.35, 1.14, 0]}>
          <boxGeometry args={[0.22, 0.16, 0.22]} />
          <meshToonMaterial color={c} gradientMap={gradientMap} />
        </mesh>
      ))}
    </group>
  );
}

const LEFT_X = -7.0;
const RIGHT_X = 7.0;
const ROW_ZS = [-6, -3, 0, 3];

// Non-interactive arcade set dressing — cabinets lining both side walls,
// a claw machine, and a prize counter — so the puzzle room reads as a real
// arcade floor instead of a terminal sitting in an empty hall.
export default function ArcadeCabinets() {
  const screenMap = useTexture("/textures/arcade-cabinet-screen.png");
  const plushMap = useTexture("/textures/plush-fuzzy.png", tileTexture(2, 2));

  return (
    <>
      {ROW_ZS.map((z, i) => (
        <Cabinet key={`l${i}`} position={[LEFT_X, 0, z]} rotationY={Math.PI / 2} variant={i} screenMap={screenMap} />
      ))}
      {ROW_ZS.map((z, i) => (
        <Cabinet
          key={`r${i}`}
          position={[RIGHT_X, 0, z]}
          rotationY={-Math.PI / 2}
          variant={i + 2}
          screenMap={screenMap}
        />
      ))}

      <ClawMachine position={[5.4, 0, 4.3]} plushMap={plushMap} />
      <PrizeCounter position={[-5.2, 0, 4.3]} />
    </>
  );
}
