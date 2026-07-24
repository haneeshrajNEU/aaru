import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getToonGradientMap } from "../../systems/toonGradient";

// Comic knockdown: Haneesh topples, then his head pops off and bounces a
// couple of times before settling — that's the cue that it's ready to
// auto-collect as the "Haneesh's Head" item.
export default function Haneesh({ position, knockedToken, onDone }) {
  const gradientMap = getToonGradientMap();
  const bodyRef = useRef();
  const headRef = useRef();
  const phase = useRef("idle");
  const startRef = useRef(0);
  const headVel = useRef(new THREE.Vector3());

  useEffect(() => {
    if (knockedToken > 0) {
      phase.current = "falling";
      startRef.current = performance.now();
    }
  }, [knockedToken]);

  useFrame((_, delta) => {
    if (phase.current === "idle" || phase.current === "done") return;
    const t = (performance.now() - startRef.current) / 1000;

    if (phase.current === "falling") {
      const p = Math.min(t / 0.5, 1);
      if (bodyRef.current) bodyRef.current.rotation.x = p * 1.4;
      if (headRef.current) headRef.current.position.y = THREE.MathUtils.lerp(1.55, 0.95, p);
      if (p >= 1) {
        phase.current = "headBounce";
        startRef.current = performance.now();
        headVel.current.set((Math.random() - 0.5) * 1.6, 2.6, Math.random() * 1.2 + 0.5);
      }
    } else if (phase.current === "headBounce") {
      const dt = Math.min(delta, 0.033);
      if (headRef.current) {
        headVel.current.y -= 7 * dt;
        headRef.current.position.x += headVel.current.x * dt;
        headRef.current.position.y += headVel.current.y * dt;
        headRef.current.position.z += headVel.current.z * dt;
        headRef.current.rotation.z += dt * 8;
        if (headRef.current.position.y <= 0.25) {
          headRef.current.position.y = 0.25;
          headVel.current.y *= -0.42;
          headVel.current.x *= 0.7;
          headVel.current.z *= 0.7;
          if (Math.abs(headVel.current.y) < 0.45) {
            phase.current = "done";
            onDone?.();
          }
        }
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={bodyRef} position={[0, 0.75, 0]}>
        <capsuleGeometry args={[0.28, 0.7, 4, 10]} />
        <meshToonMaterial color="#7aa8d9" gradientMap={gradientMap} />
      </mesh>
      <mesh ref={headRef} position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.26, 14, 14]} />
        <meshToonMaterial color="#ffd9b3" gradientMap={gradientMap} />
      </mesh>
    </group>
  );
}
