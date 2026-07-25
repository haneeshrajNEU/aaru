import { getToonGradientMap } from "../../systems/toonGradient";

function SeatingBench({ position, rotationY = 0 }) {
  const gradientMap = getToonGradientMap();
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.6, 0.12, 0.6]} />
        <meshToonMaterial color="#8a4a3a" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, 0.6, -0.26]}>
        <boxGeometry args={[1.6, 0.7, 0.08]} />
        <meshToonMaterial color="#8a4a3a" gradientMap={gradientMap} />
      </mesh>
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={i} position={[x, 0.14, 0]}>
          <boxGeometry args={[0.1, 0.28, 0.5]} />
          <meshToonMaterial color="#4a2f26" gradientMap={gradientMap} />
        </mesh>
      ))}
    </group>
  );
}

function ShoeRack({ position, rotationY = 0 }) {
  const gradientMap = getToonGradientMap();
  const shoeColors = ["#d94f4f", "#4f8fd9", "#e0b34f", "#6fbf7a"];
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 1, 0.4]} />
        <meshToonMaterial color="#5a4636" gradientMap={gradientMap} />
      </mesh>
      {shoeColors.map((c, i) => (
        <mesh key={i} position={[-0.42 + i * 0.28, 0.62, 0.22]}>
          <boxGeometry args={[0.2, 0.12, 0.32]} />
          <meshToonMaterial color={c} gradientMap={gradientMap} />
        </mesh>
      ))}
    </group>
  );
}

function DiscoBall({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.9, 4]} />
        <meshBasicMaterial color="#2a2436" />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial color="#e8e8f0" metalness={0.9} roughness={0.2} />
      </mesh>
      <pointLight color="#ffd9f0" intensity={0.4} distance={6} />
    </group>
  );
}

// Extra set dressing for the lounge area — seating and a shoe rack out in
// the open in front of the bar, plus a disco ball and a warm accent light
// over the bar itself — to round out the "hangout" feel without crowding
// any of the walls.
export default function LoungeDecor({ barPosition }) {
  return (
    <>
      <SeatingBench position={[-6, 0, 4]} rotationY={Math.PI} />
      <ShoeRack position={[-4.2, 0, 4.2]} rotationY={Math.PI} />
      <DiscoBall position={[barPosition[0], 3.2, barPosition[2]]} />
      <pointLight
        position={[barPosition[0] - 1, 3, barPosition[2] + 0.5]}
        color="#ffb347"
        intensity={0.3}
        distance={5}
      />
    </>
  );
}
