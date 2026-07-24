import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getToonGradientMap } from "../../systems/toonGradient";
import { registerInteractable } from "../../systems/interactables";
import { useUIStore } from "../../store/useUIStore";
import { useGameStore } from "../../store/useGameStore";
import Pedestal from "../shared/Pedestal";
import { PLAYER_NAME } from "../../config/constants";

export default function LoreBook({ position }) {
  const gradientMap = getToonGradientMap();
  const bookRef = useRef();

  useEffect(
    () =>
      registerInteractable({
        getPosition: () => ({ x: position[0], y: position[1], z: position[2] }),
        label: "Read the lore book",
        radius: 2.4,
        onInteract: () => {
          useGameStore.getState().setFlag("loreBookRead", true);
          useUIStore.getState().showModal({
            title: "On Magic Dust & Dioramas",
            body: `Every diorama in this room is a tiny frozen concert — a stage, a spotlight, a few idols caught mid-performance.\n\nThe old story goes that when a stage is captured just right, some of that performance energy gets left behind as a fine, glowing dust. Enough of these little stages, set exactly true, and the dust gathers into something the sunflower can actually use.\n\nThey've all slipped slightly out of place, ${PLAYER_NAME}. Nudge each one back into its correct rotation and size to release what's trapped inside.`,
          });
        },
      }),
    [position]
  );

  useFrame(({ clock }) => {
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.15;
    }
  });

  return (
    <Pedestal position={position} color="#c9b896">
      <mesh ref={bookRef} position={[0, 1.0, 0]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.4, 0.06, 0.3]} />
        <meshToonMaterial color="#8a4a3a" gradientMap={gradientMap} />
      </mesh>
    </Pedestal>
  );
}
