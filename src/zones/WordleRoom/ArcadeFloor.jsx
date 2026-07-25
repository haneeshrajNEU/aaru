import { useEffect, useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { getToonGradientMap } from "../../systems/toonGradient";
import { tileTexture } from "../../systems/textureUtils";

const ACCENT = "#ff6ad5";
const CELL = 1.4;

// The arcade carpet — a real tiled texture, plus a scatter of neon diamond
// accents laid over it for a bit of extra sparkle.
export default function ArcadeFloor({ bounds }) {
  const accentRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const gradientMap = getToonGradientMap();
  const { minX, maxX, minZ, maxZ } = bounds;
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;

  const carpetMap = useTexture("/textures/arcade-carpet.png", tileTexture(width / 3, depth / 3));

  const accents = useMemo(() => {
    const cols = Math.floor(width / CELL);
    const rows = Math.floor(depth / CELL);
    const startX = minX + (width - cols * CELL) / 2 + CELL / 2;
    const startZ = minZ + (depth - rows * CELL) / 2 + CELL / 2;
    const a = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if ((i * 7 + j * 3) % 11 === 0) a.push({ x: startX + i * CELL, z: startZ + j * CELL });
      }
    }
    return a;
  }, [bounds]);

  useEffect(() => {
    const mesh = accentRef.current;
    if (!mesh) return;
    for (let i = 0; i < accents.length; i++) {
      const it = accents[i];
      dummy.position.set(it.x, 0.008, it.z);
      dummy.rotation.set(-Math.PI / 2, 0, Math.PI / 4);
      dummy.scale.set(0.3, 0.3, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [accents]);

  return (
    <>
      <mesh position={[centerX, 0.006, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshToonMaterial map={carpetMap} gradientMap={gradientMap} />
      </mesh>
      <instancedMesh ref={accentRef} args={[null, null, accents.length]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.55} />
      </instancedMesh>
    </>
  );
}
