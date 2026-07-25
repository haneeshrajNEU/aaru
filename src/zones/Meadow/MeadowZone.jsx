import { useEffect } from "react";
import { useLevelStore } from "../../store/useLevelStore";
import { useGameStore } from "../../store/useGameStore";
import { useUIStore } from "../../store/useUIStore";
import { transitionToZone } from "../../systems/zoneTransition";
import { audioManager } from "../../systems/audioManager";
import Ground from "../shared/Ground";
import WiltedField from "../shared/WiltedField";
import DeadFlowers from "../shared/DeadFlowers";
import EmberParticles from "../shared/EmberParticles";
import Bushes from "../shared/Bushes";
import SkyDome from "../shared/SkyDome";
import Stars from "../shared/Stars";
import Sunflower from "../shared/Sunflower";
import Portal from "../shared/Portal";
import { PLAYER_NAME } from "../../config/constants";

const SUNFLOWER_POS = [0, 0, -14];
const PORTAL_POS = [5, 1.1, -9];
const BOUNDS = { minX: -17, maxX: 17, minZ: -17, maxZ: 13 };

export default function MeadowZone() {
  const flags = useGameStore((s) => s.flags);
  const setFlag = useGameStore((s) => s.setFlag);
  const setQuest = useGameStore((s) => s.setQuest);
  const setGuideTarget = useGameStore((s) => s.setGuideTarget);

  useEffect(() => {
    useLevelStore.getState().setLevel({
      bounds: BOUNDS,
      colliders: [{ x: SUNFLOWER_POS[0], z: SUNFLOWER_POS[2], radius: 0.7 }],
      spawn: { x: 0, y: 0, z: 8, yaw: 0 },
    });

    if (!flags.introSeen) {
      useUIStore.getState().showModal({
        title: `A meadow, somewhere quiet`,
        body: `Somewhere at the heart of this little world stands the last sunflower — the one that gives sunlight to everywhere else. It's fading, and with it, all the smaller flowers and grass are turning grey.\n\nTo save it, you'll need to gather magic dust, retrieve a mysterious head lost long ago, and unlock a hidden vault.\n\nTake your time, ${PLAYER_NAME}. Nothing here can go wrong.`,
        continueLabel: "Let's go",
        onContinue: () => {
          setFlag("introSeen", true);
          setQuest(`Explore the meadow and find the cozy room, ${PLAYER_NAME}.`);
          setGuideTarget({ x: PORTAL_POS[0], y: PORTAL_POS[1], z: PORTAL_POS[2] });
        },
      });
    } else {
      setQuest(`Explore the meadow and find the cozy room, ${PLAYER_NAME}.`);
      setGuideTarget({ x: PORTAL_POS[0], y: PORTAL_POS[1], z: PORTAL_POS[2] });
    }
  }, []);

  return (
    <>
      <color attach="background" args={["#cdd8e8"]} />
      <fog attach="fog" args={["#cdd8e8", 18, 42]} />
      <ambientLight intensity={0.75} color="#e8ecff" />
      <directionalLight position={[8, 12, 4]} intensity={1.1} color="#fff3d9" />

      <SkyDome />
      <Stars />

      <Ground color="#c9cdb0" />
      <WiltedField center={[0, 0, -4]} radius={16} count={110} bloomed={false} />
      <DeadFlowers center={[0, 0, -4]} radius={16} count={20} />
      <EmberParticles center={[0, 0, -4]} radius={18} height={6} count={55} />
      <Bushes bounds={BOUNDS} />
      <Sunflower position={SUNFLOWER_POS} bloomed={false} scale={1.4} />

      <Portal
        position={PORTAL_POS}
        color="#ffd9a0"
        onEnter={() => {
          audioManager.play("portal");
          transitionToZone("diorama", `Fix the dioramas, ${PLAYER_NAME}.`);
        }}
      />
    </>
  );
}
