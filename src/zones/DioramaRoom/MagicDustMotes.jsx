import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 26;

// Ambient "performance dust" drifting around the room — a quiet nod to the
// lore book's story about glowing dust left behind by frozen stages.
export default function MagicDustMotes({ bounds, height = 3 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color("#ffe08a"), []);

  const items = useMemo(() => {
    const { minX, maxX, minZ, maxZ } = bounds;
    const arr = [];
    for (let i = 0; i < COUNT; i++) {
      arr.push({
        x: minX + Math.random() * (maxX - minX),
        z: minZ + Math.random() * (maxZ - minZ),
        yOffset: Math.random() * height,
        speed: 0.08 + Math.random() * 0.1,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.2 + Math.random() * 0.3,
        scale: 0.03 + Math.random() * 0.03,
        flicker: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [bounds, height]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const y = (it.yOffset + t * it.speed) % height;
      const fade = Math.min(1, Math.min(y, height - y) * 1.5);
      const wob = t * it.driftSpeed + it.driftPhase;

      dummy.position.set(it.x + Math.sin(wob) * 0.5, y + 0.2, it.z + Math.cos(wob) * 0.5);
      const flick = 0.6 + 0.4 * Math.sin(t * 3 + it.flicker);
      dummy.scale.setScalar(Math.max(0.005, it.scale * fade * flick));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} />
    </instancedMesh>
  );
}
