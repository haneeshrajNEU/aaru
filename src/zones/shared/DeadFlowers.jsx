import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getToonGradientMap } from "../../systems/toonGradient";

const DEAD_STEM = new THREE.Color("#3f3327");
const DEAD_HEAD = new THREE.Color("#221c17");
const REVIVED_STEM = new THREE.Color("#4f8f52");

// Taller, snapped-over flower stalks scattered through the field — a
// darker, static counterpart to WiltedField's small color-shifting blooms.
// By default (`bloomed=false`) they stay dead permanently, like in the
// meadow. When a caller does pass `bloomed`, each head eases into its own
// random rainbow hue instead of staying dark, for a "everything turns
// colorful" payoff.
export default function DeadFlowers({ count = 20, radius = 15, center = [0, 0, 0], bloomed = false }) {
  const stemRef = useRef();
  const headRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const gradientMap = getToonGradientMap();
  const bloomT = useRef(bloomed ? 1 : 0);
  const tint = useMemo(() => new THREE.Color(), []);
  const rainbow = useMemo(() => new THREE.Color(), []);

  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      arr.push({
        x: center[0] + Math.cos(a) * r,
        z: center[2] + Math.sin(a) * r,
        yaw: Math.random() * Math.PI * 2,
        lean: 0.9 + Math.random() * 0.5,
        h: 0.4 + Math.random() * 0.4,
        hue: Math.random(),
      });
    }
    return arr;
  }, [count, radius, center[0], center[2]]);

  useEffect(() => {
    const stems = stemRef.current;
    const heads = headRef.current;
    if (!stems || !heads) return;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];

      dummy.position.set(it.x, 0, it.z);
      dummy.rotation.set(it.lean, it.yaw, 0);
      dummy.updateMatrix();
      dummy.translateY(it.h / 2);
      dummy.scale.set(1, it.h, 1);
      dummy.updateMatrix();
      stems.setMatrixAt(i, dummy.matrix);

      dummy.position.set(it.x, 0, it.z);
      dummy.rotation.set(it.lean, it.yaw, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      dummy.translateY(it.h);
      dummy.scale.set(0.14, 0.09, 0.14);
      dummy.updateMatrix();
      heads.setMatrixAt(i, dummy.matrix);
    }
    stems.instanceMatrix.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
  }, [items]);

  useFrame((_, delta) => {
    const stems = stemRef.current;
    const heads = headRef.current;
    if (!stems || !heads) return;
    const target = bloomed ? 1 : 0;
    bloomT.current += (target - bloomT.current) * Math.min(delta * 0.6, 1);
    const t = bloomT.current;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      tint.copy(DEAD_STEM).lerp(REVIVED_STEM, t);
      stems.setColorAt(i, tint);

      rainbow.setHSL(it.hue, 0.75, 0.58);
      tint.copy(DEAD_HEAD).lerp(rainbow, t);
      heads.setColorAt(i, tint);
    }
    stems.instanceColor.needsUpdate = true;
    heads.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={stemRef} args={[null, null, items.length]} frustumCulled={false}>
        <cylinderGeometry args={[0.014, 0.02, 1, 5]} />
        <meshToonMaterial gradientMap={gradientMap} />
      </instancedMesh>
      <instancedMesh ref={headRef} args={[null, null, items.length]} frustumCulled={false}>
        <sphereGeometry args={[1, 7, 6]} />
        <meshToonMaterial gradientMap={gradientMap} />
      </instancedMesh>
    </>
  );
}
