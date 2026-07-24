import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getToonGradientMap } from "../../systems/toonGradient";

const GREY_GREEN = new THREE.Color("#9a9a86");
const VIVID_GREEN = new THREE.Color("#5fae52");
const GREY_BROWN = new THREE.Color("#8a8378");
const VIVID_BROWN = new THREE.Color("#7a4a24");
const GREY_PETAL = new THREE.Color("#b0ac9c");
const VIVID_PETAL = new THREE.Color("#ffd452");

const PETAL_COUNT = 14;

// The centerpiece sunflower. `bloomed` drives an eased transition from
// grey/drooped to vivid/upright — used for the intro (always wilted) and
// the finale (wilted -> bloomed on command).
export default function Sunflower({ position = [0, 0, 0], bloomed = false, scale = 1 }) {
  const bloomT = useRef(bloomed ? 1 : 0);
  const headRef = useRef();
  const stemMat = useRef();
  const leafMat = useRef();
  const discMat = useRef();
  const petalsRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const gradientMap = getToonGradientMap();

  useFrame((_, delta) => {
    const target = bloomed ? 1 : 0;
    bloomT.current += (target - bloomT.current) * Math.min(delta * 0.8, 1);
    const t = bloomT.current;

    if (headRef.current) {
      headRef.current.rotation.x = THREE.MathUtils.lerp(1.05, 0.05, t);
      headRef.current.rotation.z = THREE.MathUtils.lerp(0.35, 0, t);
    }

    const green = GREY_GREEN.clone().lerp(VIVID_GREEN, t);
    if (stemMat.current) stemMat.current.color.copy(green);
    if (leafMat.current) leafMat.current.color.copy(green);

    if (discMat.current) discMat.current.color.copy(GREY_BROWN.clone().lerp(VIVID_BROWN, t));

    const petalColor = GREY_PETAL.clone().lerp(VIVID_PETAL, t);
    if (petalsRef.current) {
      for (let i = 0; i < PETAL_COUNT; i++) {
        const angle = (i / PETAL_COUNT) * Math.PI * 2;
        dummy.position.set(Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5);
        dummy.rotation.set(0, -angle + Math.PI / 2, 0);
        dummy.scale.set(0.4, 0.13, 0.18);
        dummy.updateMatrix();
        petalsRef.current.setMatrixAt(i, dummy.matrix);
        petalsRef.current.setColorAt(i, petalColor);
      }
      petalsRef.current.instanceMatrix.needsUpdate = true;
      if (petalsRef.current.instanceColor) petalsRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 2.4, 8]} />
        <meshToonMaterial ref={stemMat} gradientMap={gradientMap} />
      </mesh>

      <mesh position={[0.28, 0.95, 0.05]} rotation={[0.2, 0.4, -0.5]} scale={[0.4, 0.14, 0.3]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshToonMaterial ref={leafMat} gradientMap={gradientMap} />
      </mesh>
      <mesh position={[-0.3, 0.7, -0.05]} rotation={[-0.2, -0.5, 0.5]} scale={[0.4, 0.14, 0.3]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshToonMaterial gradientMap={gradientMap} />
      </mesh>

      <group ref={headRef} position={[0, 2.4, 0]}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 0.16, 16]} />
          <meshToonMaterial ref={discMat} gradientMap={gradientMap} />
        </mesh>
        <instancedMesh ref={petalsRef} args={[null, null, PETAL_COUNT]} frustumCulled={false}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshToonMaterial gradientMap={gradientMap} toneMapped={false} />
        </instancedMesh>
      </group>
    </group>
  );
}
