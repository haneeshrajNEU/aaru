import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../store/useGameStore";

const COUNT = 14;

// A gentle trail of firefly/pollen particles that drift from the player
// toward the current guide target. Purely cosmetic, toggleable in settings.
export default function GuideTrail() {
  const meshRef = useRef();
  const { camera } = useThree();
  const phases = useMemo(
    () => new Array(COUNT).fill(0).map(() => Math.random() * Math.PI * 2),
    []
  );
  const seeds = useMemo(() => new Array(COUNT).fill(0).map(() => Math.random()), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color("#fff2b8"), []);

  useFrame(({ clock }) => {
    const { guideTarget, settings } = useGameStore.getState();
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!settings.guideEnabled || !guideTarget) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;

    const t = clock.getElapsedTime();
    const from = camera.position;
    const to = guideTarget;

    for (let i = 0; i < COUNT; i++) {
      const seed = seeds[i];
      const raw = (seed + t * 0.12) % 1; // 0 = near player, 1 = near target
      const along = 0.22 + raw * 0.78; // keep fireflies from clumping right on the camera
      const x = THREE.MathUtils.lerp(from.x, to.x, along);
      const z = THREE.MathUtils.lerp(from.z, to.z, along);
      const baseY = THREE.MathUtils.lerp(from.y - 0.6, to.y + 0.3, along);

      const wobble = Math.sin(t * 1.6 + phases[i]) * 0.25;
      const wobbleX = Math.cos(t * 1.3 + phases[i]) * 0.35;

      dummy.position.set(x + wobbleX, baseY + wobble + 0.4, z);
      const s = 0.035 + 0.018 * Math.sin(t * 3 + phases[i]);
      dummy.scale.setScalar(Math.max(0.02, s));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.9} />
    </instancedMesh>
  );
}
