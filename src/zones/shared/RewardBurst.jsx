import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DURATION = 1.6;

// One-shot particle burst used whenever a reward is auto-granted (dioramas
// complete, wordle solved, etc.). `trigger` toggling true->true again won't
// re-fire — flip it via a fresh boolean/key from the caller.
export default function RewardBurst({ trigger, position = [0, 1, 0], count = 36, color = "#ffe28a" }) {
  const meshRef = useRef();
  const matRef = useRef();
  const startRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dirs = useMemo(
    () =>
      new Array(count).fill(0).map(() => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI - Math.PI / 2;
        return new THREE.Vector3(
          Math.cos(theta) * Math.cos(phi),
          Math.sin(phi) + 0.5,
          Math.sin(theta) * Math.cos(phi)
        );
      }),
    [count]
  );

  useEffect(() => {
    if (trigger) startRef.current = performance.now();
  }, [trigger]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (startRef.current === null) {
      mesh.visible = false;
      return;
    }
    const elapsed = (performance.now() - startRef.current) / 1000;
    if (elapsed > DURATION) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;
    const t = elapsed / DURATION;
    if (matRef.current) matRef.current.opacity = 1 - t;

    for (let i = 0; i < count; i++) {
      const d = dirs[i];
      dummy.position.set(
        position[0] + d.x * t * 2.4,
        position[1] + d.y * t * 2.4,
        position[2] + d.z * t * 2.4
      );
      dummy.scale.setScalar(Math.max(0.01, 0.09 * (1 - t * 0.6)));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false} visible={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial ref={matRef} color={color} transparent toneMapped={false} />
    </instancedMesh>
  );
}
