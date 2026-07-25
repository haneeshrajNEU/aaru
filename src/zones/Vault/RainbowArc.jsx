import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const RAINBOW = ["#c76aff", "#4ab8ff", "#4adfc7", "#7ed957", "#ffe066", "#ff9f4a", "#ff5a5a"];
const BASE_RADIUS = 3.4;
const RING_SPACING = 0.24;

// A cheerful rainbow arch that eases in above the sunflower once every
// vault slot is filled — the literal payoff for "we get a rainbow."
// Hidden entirely (not just transparent) until `bloomed` starts lifting it.
export default function RainbowArc({ position = [0, 0, 0], bloomed }) {
  const groupRef = useRef();
  const opacityRef = useRef(0);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const target = bloomed ? 1 : 0;
    opacityRef.current += (target - opacityRef.current) * Math.min(delta * 0.4, 1);
    const o = opacityRef.current;

    group.visible = o > 0.01;
    group.position.y = position[1] + 4.4 + Math.sin(clock.getElapsedTime() * 0.5) * 0.15;
    group.children.forEach((child) => {
      if (child.material) child.material.opacity = o * 0.85;
    });
  });

  return (
    <group ref={groupRef} position={[position[0], position[1] + 4.4, position[2]]} visible={false}>
      {RAINBOW.map((color, i) => (
        <mesh key={color}>
          <torusGeometry args={[BASE_RADIUS + i * RING_SPACING, 0.09, 8, 32, Math.PI]} />
          <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
