import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DARK_EMBER = new THREE.Color("#3a160c");
const HOT_EMBER = new THREE.Color("#ff6a2b");
const BLOOM_DARK = new THREE.Color("#7a5a10");
const BLOOM_HOT = new THREE.Color("#fff2a0");

// Dying embers/ash that drift slowly upward and flicker between a dull char
// and a brief hot spark before looping back to the ground. Purely
// atmospheric. When a caller passes `bloomed`, the palette eases from
// charcoal-ember tones into a warm glowy-yellow gold instead.
export default function EmberParticles({ count = 55, radius = 16, center = [0, 0, 0], height = 6, bloomed = false }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tint = useMemo(() => new THREE.Color(), []);
  const darkNow = useMemo(() => new THREE.Color(), []);
  const hotNow = useMemo(() => new THREE.Color(), []);
  const bloomT = useRef(bloomed ? 1 : 0);

  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      arr.push({
        x: center[0] + Math.cos(a) * r,
        z: center[2] + Math.sin(a) * r,
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * height,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.3 + Math.random() * 0.5,
        scale: 0.045 + Math.random() * 0.05,
        flicker: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count, radius, center[0], center[2], height]);

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    const target = bloomed ? 1 : 0;
    bloomT.current += (target - bloomT.current) * Math.min(delta * 0.5, 1);
    const bt = bloomT.current;
    darkNow.copy(DARK_EMBER).lerp(BLOOM_DARK, bt);
    hotNow.copy(HOT_EMBER).lerp(BLOOM_HOT, bt);

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const y = (it.offset + t * it.speed) % height;
      const fade = Math.min(1, Math.min(y, height - y) * 1.2);
      const wob = t * it.driftSpeed + it.drift;

      dummy.position.set(it.x + Math.sin(wob) * 0.6, y + 0.15, it.z + Math.cos(wob) * 0.6);
      const flick = 0.55 + 0.45 * Math.sin(t * 4.5 + it.flicker);
      dummy.scale.setScalar(Math.max(0.005, it.scale * fade * flick * (1 + bt * 0.35)));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tint.copy(darkNow).lerp(hotNow, flick);
      mesh.setColorAt(i, tint);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.85} depthWrite={false} />
    </instancedMesh>
  );
}
