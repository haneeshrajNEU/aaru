import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getToonGradientMap } from "../../systems/toonGradient";

const COLORS = ["#7a8f6a", "#6d8460", "#869c72"];

// A ring of low-poly bush clumps placed just outside the zone's walkable
// bounds so the field reads as an enclosed clearing instead of stretching
// on forever. Purely a visual backdrop — the player is already clamped to
// `bounds` by the level collision, this just makes that edge legible.
export default function Bushes({ bounds, spacing = 1.6, inset = 1.2, blobsPerBush = 3 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObjs = useMemo(() => COLORS.map((c) => new THREE.Color(c)), []);

  const spots = useMemo(() => {
    const { minX, maxX, minZ, maxZ } = bounds;
    const xLen = maxX - minX;
    const zLen = maxZ - minZ;
    const stepsX = Math.max(1, Math.round(xLen / spacing));
    const stepsZ = Math.max(1, Math.round(zLen / spacing));
    const pts = [];

    for (let i = 0; i <= stepsX; i++) {
      const x = minX + (xLen * i) / stepsX;
      pts.push([x, minZ - inset]);
      pts.push([x, maxZ + inset]);
    }
    for (let i = 0; i <= stepsZ; i++) {
      const z = minZ + (zLen * i) / stepsZ;
      pts.push([minX - inset, z]);
      pts.push([maxX + inset, z]);
    }
    return pts;
  }, [bounds, spacing, inset]);

  const items = useMemo(() => {
    const arr = [];
    for (const [x, z] of spots) {
      for (let b = 0; b < blobsPerBush; b++) {
        arr.push({
          x: x + (Math.random() - 0.5) * 0.9,
          z: z + (Math.random() - 0.5) * 0.9,
          y: 0.3 + Math.random() * 0.25,
          yaw: Math.random() * Math.PI * 2,
          scale: 0.55 + Math.random() * 0.6,
          squash: 0.65 + Math.random() * 0.3,
          color: colorObjs[Math.floor(Math.random() * colorObjs.length)],
        });
      }
    }
    return arr;
  }, [spots, blobsPerBush, colorObjs]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      dummy.position.set(it.x, it.y, it.z);
      dummy.rotation.set(0, it.yaw, 0);
      dummy.scale.set(it.scale, it.scale * it.squash, it.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, it.color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, items.length]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshToonMaterial gradientMap={getToonGradientMap()} />
    </instancedMesh>
  );
}
