import { getToonGradientMap } from "../../systems/toonGradient";

const POSTER_COLORS = ["#ff9fc7", "#9fd8ff", "#ffe08a", "#c7a8ff", "#9fe8c7"];

function Poster({ position, rotationY = 0, color, size = [0.9, 1.2] }) {
  const gradientMap = getToonGradientMap();
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[size[0] + 0.1, size[1] + 0.1, 0.04]} />
        <meshToonMaterial color="#5a4636" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[size[0], size[1], 0.02]} />
        <meshToonMaterial color={color} gradientMap={gradientMap} />
      </mesh>
    </group>
  );
}

function PottedPlant({ position }) {
  const gradientMap = getToonGradientMap();
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.28, 0.22, 0.5, 10]} />
        <meshToonMaterial color="#a86a4a" gradientMap={gradientMap} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.12, 0.65 + i * 0.05, Math.sin(a) * 0.12]} rotation={[0.3, a, 0]}>
            <coneGeometry args={[0.16, 0.55, 6]} />
            <meshToonMaterial color="#4f8f52" gradientMap={gradientMap} />
          </mesh>
        );
      })}
    </group>
  );
}

function FloorLamp({ position }) {
  const gradientMap = getToonGradientMap();
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.04, 12]} />
        <meshToonMaterial color="#3a2f2a" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
        <meshToonMaterial color="#2a2320" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, 2.25, 0]}>
        <coneGeometry args={[0.32, 0.5, 12]} />
        <meshToonMaterial color="#fff2c9" gradientMap={gradientMap} emissive="#ffdd8a" emissiveIntensity={0.4} />
      </mesh>
      <pointLight position={[0, 2.1, 0]} color="#ffd58a" intensity={0.55} distance={7} />
    </group>
  );
}

// Non-interactive set dressing for the diorama room — rug, tour posters,
// potted plants, and floor lamps — so the space reads as a lived-in
// backstage room instead of four bare walls around the puzzle pedestals.
export default function RoomDecor() {
  const gradientMap = getToonGradientMap();

  return (
    <>
      <mesh position={[0, -0.02, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 5.4]} />
        <meshToonMaterial color="#8a3a3a" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[0, -0.015, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 4.4]} />
        <meshToonMaterial color="#c9a05a" gradientMap={gradientMap} />
      </mesh>

      <Poster position={[-6, 2.5, -9.23]} color={POSTER_COLORS[0]} />
      <Poster position={[-2.6, 2.6, -9.23]} color={POSTER_COLORS[1]} />
      <Poster position={[2.6, 2.6, -9.23]} color={POSTER_COLORS[2]} />
      <Poster position={[6, 2.5, -9.23]} color={POSTER_COLORS[3]} />

      <Poster position={[-7.98, 2.5, -4]} rotationY={Math.PI / 2} color={POSTER_COLORS[4]} />
      <Poster position={[-7.98, 2.5, 1.5]} rotationY={Math.PI / 2} color={POSTER_COLORS[1]} />
      <Poster position={[7.98, 2.5, -4]} rotationY={-Math.PI / 2} color={POSTER_COLORS[2]} />
      <Poster position={[7.98, 2.5, 1.5]} rotationY={-Math.PI / 2} color={POSTER_COLORS[0]} />

      <PottedPlant position={[-7, 0, 4.8]} />
      <PottedPlant position={[-7, 0, -8.6]} />
      <PottedPlant position={[7, 0, -8.6]} />

      <FloorLamp position={[-7.3, 0, -1.5]} />
      <FloorLamp position={[7.3, 0, -1.5]} />
    </>
  );
}
