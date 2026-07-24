import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { registerInteractable } from "../../systems/interactables";
import { useUIStore } from "../../store/useUIStore";
import { useGameStore } from "../../store/useGameStore";
import { audioManager } from "../../systems/audioManager";

export default function LetterPickup({ position }) {
  const ref = useRef();

  useEffect(
    () =>
      registerInteractable({
        getPosition: () => ({ x: position[0], y: position[1], z: position[2] }),
        label: "Oh — there's a letter for you",
        radius: 2.2,
        onInteract: () => {
          useGameStore.getState().setFlag("letterFound", true);
          useGameStore.getState().setFlag("letterRead", true);
          audioManager.play("pickup");
          useUIStore.getState().openLetter();
        },
      }),
    [position]
  );

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + 0.5 + Math.sin(clock.getElapsedTime() * 1.5) * 0.08;
      ref.current.rotation.y += 0.015;
    }
  });

  return (
    <mesh ref={ref} position={[position[0], position[1] + 0.5, position[2]]} frustumCulled={false}>
      <planeGeometry args={[0.34, 0.24]} />
      <meshBasicMaterial color="#fff6df" toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}
