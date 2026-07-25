import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 34;
const HUES = ["#ff6ad5", "#6affe8", "#ffe86a", "#8a6aff"];

// Ambient neon sparks drifting through the arcade floor — a cosmetic nod to
// the cabinets' glow rather than anything gameplay-relevant.
export default function ArcadeGlow({ bounds, height = 3 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => HUES.map((c) => new THREE.Color(c)), []);

  const items = useMemo(() => {
    const { minX, maxX, minZ, maxZ } = bounds;
    const arr = [];
    for (let i = 0; i < COUNT; i++) {
      arr.push({
        x: minX + Math.random() * (maxX - minX),
        z: minZ + Math.random() * (maxZ - minZ),
        yOffset: Math.random() * height,
        speed: 0.1 + Math.random() * 0.12,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.25 + Math.random() * 0.35,
        scale: 0.035 + Math.random() * 0.03,
        flicker: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
      });
    }
    return arr;
  }, [bounds, height, colors]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const y = (it.yOffset + t * it.speed) % height;
      const fade = Math.min(1, Math.min(y, height - y) * 1.4);
      const wob = t * it.driftSpeed + it.driftPhase;

      dummy.position.set(it.x + Math.sin(wob) * 0.5, y + 0.2, it.z + Math.cos(wob) * 0.5);
      const flick = 0.6 + 0.4 * Math.sin(t * 3.5 + it.flicker);
      dummy.scale.setScalar(Math.max(0.005, it.scale * fade * flick));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, it.color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.85} />
    </instancedMesh>
  );
}
