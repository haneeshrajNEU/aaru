import { useEffect, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useLevelStore } from "../../store/useLevelStore";
import { useGameStore } from "../../store/useGameStore";
import { transitionToZone } from "../../systems/zoneTransition";
import { audioManager } from "../../systems/audioManager";
import { getToonGradientMap } from "../../systems/toonGradient";
import { ITEMS } from "../../config/items";
import { pushItemToast } from "../../components/ToastStack";
import { PLAYER_NAME } from "../../config/constants";
import Portal from "../shared/Portal";
import RewardBurst from "../shared/RewardBurst";
import LoreBook from "./LoreBook";
import Diorama from "./Diorama";
import RoomDecor from "./RoomDecor";
import MagicDustMotes from "./MagicDustMotes";
import { tileTexture } from "../../systems/textureUtils";

const DIORAMAS = [
  { position: [-5, 0, -7.5], label: "Center Stage", correctRotation: 0, correctScale: 1 },
  { position: [-1.8, 0, -8], label: "Encore", correctRotation: 130, correctScale: 0.85 },
  { position: [1.8, 0, -8], label: "Debut Night", correctRotation: 250, correctScale: 1.1 },
  { position: [5, 0, -7.5], label: "Fan Meet", correctRotation: 40, correctScale: 0.95 },
];

const REWARD_POS = [0, 1, -3];
const PORTAL_POS = [6.3, 1.1, 4.5];
const ROOM_BOUNDS = { minX: -7.3, maxX: 7.3, minZ: -9.3, maxZ: 5.7 };

export default function DioramaZone() {
  const flags = useGameStore((s) => s.flags);
  const setFlagPath = useGameStore((s) => s.setFlagPath);
  const setFlag = useGameStore((s) => s.setFlag);
  const addItem = useGameStore((s) => s.addItem);
  const setQuest = useGameStore((s) => s.setQuest);
  const setGuideTarget = useGameStore((s) => s.setGuideTarget);
  const gradientMap = getToonGradientMap();
  const grantedRef = useRef(flags.dioramaRewardGiven);
  const [burstKey, setBurstKey] = useState(0);
  const floorMap = useTexture("/textures/wood-floor-warm.png", tileTexture(6, 6));

  useEffect(() => {
    useLevelStore.getState().setLevel({
      bounds: ROOM_BOUNDS,
      colliders: [
        { x: -4, z: 3, radius: 0.7 },
        ...DIORAMAS.map((d) => ({ x: d.position[0], z: d.position[2], radius: 0.75 })),
      ],
      spawn: { x: 0, y: 0, z: 5, yaw: 0 },
    });

    if (!flags.dioramaRewardGiven) {
      setQuest(`Fix all four dioramas, ${PLAYER_NAME}.`);
      setGuideTarget({ x: DIORAMAS[0].position[0], y: 1, z: DIORAMAS[0].position[2] });
    } else {
      setQuest(`Head next door to the bar, ${PLAYER_NAME}.`);
      setGuideTarget({ x: PORTAL_POS[0], y: PORTAL_POS[1], z: PORTAL_POS[2] });
    }
  }, []);

  const handleSolved = (index) => {
    setFlagPath("dioramasFixed", index, true);
    audioManager.play("correct");

    const allFixed = flags.dioramasFixed.every((f, i) => (i === index ? true : f));
    if (allFixed && !grantedRef.current) {
      grantedRef.current = true;
      setBurstKey((k) => k + 1);
      setTimeout(() => {
        addItem("musicDisc");
        addItem("magicDust");
        pushItemToast(ITEMS.musicDisc);
        pushItemToast(ITEMS.magicDust);
        setFlag("dioramaRewardGiven", true);
        setQuest(`Head next door to the bar, ${PLAYER_NAME}.`);
        setGuideTarget({ x: PORTAL_POS[0], y: PORTAL_POS[1], z: PORTAL_POS[2] });
      }, 500);
    }
  };

  return (
    <>
      <color attach="background" args={["#cfe8ff"]} />
      <fog attach="fog" args={["#cfe8ff", 18, 36]} />
      <ambientLight intensity={0.95} color="#fff6e0" />
      <directionalLight position={[6, 11, 4]} intensity={1.15} color="#fff3d9" />
      <pointLight position={[0, 4, -3]} intensity={0.3} color="#ffcf8a" distance={16} />
      <pointLight position={[0, 3, 3]} intensity={0.2} color="#ffd9a5" distance={10} />

      {/* floor */}
      <mesh position={[0, -0.05, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 15]} />
        <meshToonMaterial map={floorMap} gradientMap={gradientMap} />
      </mesh>
      {/* back + side walls */}
      <mesh position={[0, 2, -9.4]}>
        <boxGeometry args={[16, 4, 0.3]} />
        <meshToonMaterial color="#e0c9a0" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[-8.15, 2, -1.5]}>
        <boxGeometry args={[0.3, 4, 15]} />
        <meshToonMaterial color="#d4b48c" gradientMap={gradientMap} />
      </mesh>
      <mesh position={[8.15, 2, -1.5]}>
        <boxGeometry args={[0.3, 4, 15]} />
        <meshToonMaterial color="#d4b48c" gradientMap={gradientMap} />
      </mesh>

      <RoomDecor />
      <MagicDustMotes bounds={ROOM_BOUNDS} />

      <LoreBook position={[-4, 0, 3]} />

      {DIORAMAS.map((d, i) => (
        <Diorama
          key={i}
          index={i}
          position={d.position}
          label={d.label}
          correctRotation={d.correctRotation}
          correctScale={d.correctScale}
          fixed={flags.dioramasFixed[i]}
          onSolved={() => handleSolved(i)}
        />
      ))}

      <RewardBurst trigger={burstKey > 0} position={REWARD_POS} color="#ffe28a" />

      {flags.dioramaRewardGiven && (
        <Portal
          position={PORTAL_POS}
          color="#ffb3d9"
          onEnter={() => {
            audioManager.play("portal");
            transitionToZone("barBowling", `Get a drink and check out the bowling alley, ${PLAYER_NAME}.`);
          }}
        />
      )}
    </>
  );
}
