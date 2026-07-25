import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getToonGradientMap } from "../../systems/toonGradient";

const CELL = 1.4;
const COLOR_A = "#241a3d";
const COLOR_B = "#2f2350";
const ACCENT = "#ff6ad5";

// A loud checkerboard-with-neon-diamonds carpet laid over the ground plane,
// the way real arcades tend to overdo their flooring.
export default function ArcadeFloor({ bounds }) {
  const meshRef = useRef();
  const accentRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const gradientMap = getToonGradientMap();

  const { tiles, accents } = useMemo(() => {
    const { minX, maxX, minZ, maxZ } = bounds;
    const cols = Math.floor((maxX - minX) / CELL);
    const rows = Math.floor((maxZ - minZ) / CELL);
    const startX = minX + ((maxX - minX) - cols * CELL) / 2 + CELL / 2;
    const startZ = minZ + ((maxZ - minZ) - rows * CELL) / 2 + CELL / 2;
    const t = [];
    const a = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = startX + i * CELL;
        const z = startZ + j * CELL;
        t.push({ x, z, dark: (i + j) % 2 === 0 });
        if ((i * 7 + j * 3) % 11 === 0) a.push({ x, z });
      }
    }
    return { tiles: t, accents: a };
  }, [bounds]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const colorA = new THREE.Color(COLOR_A);
    const colorB = new THREE.Color(COLOR_B);
    for (let i = 0; i < tiles.length; i++) {
      const it = tiles[i];
      dummy.position.set(it.x, 0.006, it.z);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.set(CELL * 0.96, CELL * 0.96, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, it.dark ? colorA : colorB);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [tiles]);

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
      <instancedMesh ref={meshRef} args={[null, null, tiles.length]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshToonMaterial gradientMap={gradientMap} />
      </instancedMesh>
      <instancedMesh ref={accentRef} args={[null, null, accents.length]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.55} />
      </instancedMesh>
    </>
  );
}
