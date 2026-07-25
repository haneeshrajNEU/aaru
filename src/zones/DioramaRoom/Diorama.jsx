import { useEffect, useMemo, useRef } from "react";
import { getToonGradientMap } from "../../systems/toonGradient";
import { registerInteractable } from "../../systems/interactables";
import { useDioramaEditStore, angularDistance } from "../../store/useDioramaEditStore";
import Pedestal from "../shared/Pedestal";

const STAGE_COLORS = ["#ff9fc7", "#9fd8ff", "#ffe08a", "#c7a8ff"];

// A tiny K-pop stage: platform, spotlight cone, and a couple of idol
// stand-ins. The whole assembly is offset from its correct rotation/scale
// until the player fixes it via the slider panel.
export default function Diorama({ index, position, label, correctRotation, correctScale, fixed, onSolved }) {
  const gradientMap = getToonGradientMap();
  const groupRef = useRef();
  const notchRef = useRef();

  const wrong = useMemo(() => {
    const sign = index % 2 === 0 ? 1 : -1;
    return {
      rotation: (correctRotation + sign * (75 + Math.random() * 90)) % 360,
      scale: correctScale * (0.55 + Math.random() * 0.15),
    };
  }, [index, correctRotation, correctScale]);

  const activeIndex = useDioramaEditStore((s) => s.activeIndex);
  const liveRotation = useDioramaEditStore((s) => s.rotation);
  const liveScale = useDioramaEditStore((s) => s.scale);

  const isEditing = activeIndex === index;
  const rotationDeg = fixed ? correctRotation : isEditing ? liveRotation : wrong.rotation;
  const scale = fixed ? correctScale : isEditing ? liveScale : wrong.scale;

  useEffect(() => {
    const label = fixed ? "Already looks perfect" : "Fix the diorama";
    return registerInteractable({
      getPosition: () => ({ x: position[0], y: position[1], z: position[2] }),
      label,
      radius: 2.4,
      onInteract: () => {
        if (fixed) return;
        useDioramaEditStore.getState().open({
          index,
          rotation: wrong.rotation,
          scale: wrong.scale,
          correctRotation,
          correctScale,
          onSolved,
        });
      },
    });
  }, [fixed, position, index, wrong, correctRotation, correctScale, onSolved]);

  const nearlyThere =
    !fixed && angularDistance(rotationDeg, correctRotation) < 25 && Math.abs(scale - correctScale) < 0.15;
  const glowing = fixed || nearlyThere;

  return (
    <group position={position}>
      <Pedestal color="#d8c9b0" label={label}>
        {/* correct-angle notch marker, fixed to the pedestal */}
        <mesh
          ref={notchRef}
          position={[Math.sin((correctRotation * Math.PI) / 180) * 0.5, 0.86, Math.cos((correctRotation * Math.PI) / 180) * 0.5]}
        >
          <boxGeometry args={[0.08, 0.03, 0.16]} />
          <meshBasicMaterial color={fixed ? "#8fd19e" : "#ff8c42"} toneMapped={false} />
        </mesh>
      </Pedestal>

      <group
        ref={groupRef}
        position={[0, 0.86, 0]}
        rotation={[0, (rotationDeg * Math.PI) / 180, 0]}
        scale={scale}
      >
        {/* stage platform */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 16]} />
          <meshToonMaterial color={STAGE_COLORS[index % STAGE_COLORS.length]} gradientMap={gradientMap} />
        </mesh>
        {/* front marker stripe on the moving piece */}
        <mesh position={[0, 0.09, 0.4]}>
          <boxGeometry args={[0.1, 0.02, 0.1]} />
          <meshBasicMaterial color="#3a2f45" toneMapped={false} />
        </mesh>
        {/* spotlight */}
        <mesh position={[0, 0.55, -0.15]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.16, 0.4, 10]} />
          <meshToonMaterial
            color="#fff6d0"
            gradientMap={gradientMap}
            emissive="#fff2a0"
            emissiveIntensity={fixed ? 0.5 : 0.18}
          />
        </mesh>
        {/* tiny idols */}
        {[[-0.14, 0.1], [0.12, 0.05], [0, -0.15]].map(([x, z], i) => (
          <group key={i} position={[x, 0.12, z]}>
            <mesh position={[0, 0.09, 0]}>
              <capsuleGeometry args={[0.045, 0.1, 4, 8]} />
              <meshToonMaterial color="#fff0e6" gradientMap={gradientMap} />
            </mesh>
            <mesh position={[0, 0.19, 0]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshToonMaterial color="#3a2f2a" gradientMap={gradientMap} />
            </mesh>
          </group>
        ))}
      </group>

      {glowing && (
        <pointLight
          position={[0, 1.4, 0]}
          color={fixed ? "#ffe9a8" : "#ffd966"}
          intensity={fixed ? 0.6 : 0.5}
          distance={fixed ? 3.6 : 3}
        />
      )}
    </group>
  );
}
