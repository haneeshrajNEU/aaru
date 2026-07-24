import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getToonGradientMap } from "../../systems/toonGradient";

const GREY = new THREE.Color("#a6a08f");
const PALETTE = ["#ffc1cc", "#bfd7ff", "#ffe08a", "#d9c9f0", "#ffb3a3"];

const WAVE_SPEED = 5; // meters/sec the bloom wipes outward

// A scattered field of small flowers that sit desaturated/grey until
// `bloomed` flips true, at which point a wave of color ripples outward
// from `center`.
export default function WiltedField({ count = 90, radius = 14, center = [0, 0, 0], bloomed = false }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const [bloomStart, setBloomStart] = useState(null);

  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const dist = Math.sqrt((x - center[0]) ** 2 + (z - center[2]) ** 2);
      arr.push({
        x: center[0] + x,
        z: center[2] + z,
        dist,
        scale: 0.18 + Math.random() * 0.22,
        color: new THREE.Color(PALETTE[i % PALETTE.length]),
        sway: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count, radius, center[0], center[2]]);

  useEffect(() => {
    if (bloomed && bloomStart === null) setBloomStart(performance.now());
    if (!bloomed) setBloomStart(null);
  }, [bloomed]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const waveRadius = bloomStart !== null ? ((performance.now() - bloomStart) / 1000) * WAVE_SPEED : -1;
    const t = clock.getElapsedTime();

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const bloomedHere = waveRadius >= it.dist;
      const edgeGlow = bloomedHere && waveRadius - it.dist < 1.5;
      const sway = Math.sin(t * 1.5 + it.sway) * 0.06;

      dummy.position.set(it.x, it.scale * 1.1, it.z);
      dummy.rotation.set(0, it.sway, sway);
      const popScale = edgeGlow ? it.scale * 1.3 : it.scale;
      dummy.scale.setScalar(popScale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, bloomedHere ? it.color : GREY);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, items.length]} frustumCulled={false}>
      <coneGeometry args={[0.1, 0.22, 6]} />
      <meshToonMaterial gradientMap={getToonGradientMap()} toneMapped={false} />
    </instancedMesh>
  );
}
