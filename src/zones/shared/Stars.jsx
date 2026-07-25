import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A scatter of twinkling points near the top of the sky dome — a quiet nod
// to the snow-globe framing rather than a literal night sky.
export default function Stars({ count = 90, radius = 65 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const elevation = (Math.PI / 2) * (0.25 + Math.pow(Math.random(), 1.5) * 0.7);
      arr.push({
        x: Math.cos(theta) * Math.cos(elevation) * radius,
        y: Math.sin(elevation) * radius,
        z: Math.sin(theta) * Math.cos(elevation) * radius,
        scale: 0.12 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.8,
      });
    }
    return arr;
  }, [count, radius]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const flick = 0.5 + 0.5 * Math.sin(t * it.speed + it.phase);
      dummy.position.set(it.x, it.y, it.z);
      dummy.scale.setScalar(it.scale * (0.55 + flick * 0.6));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false} renderOrder={-2}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshBasicMaterial color="#fff6d8" toneMapped={false} fog={false} />
    </instancedMesh>
  );
}
