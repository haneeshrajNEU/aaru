import { useGameStore } from "../store/useGameStore";
import MeadowZone from "./Meadow/MeadowZone";
import DioramaZone from "./DioramaRoom/DioramaZone";
import BarBowlingZone from "./BarBowling/BarBowlingZone";
import WordleZone from "./WordleRoom/WordleZone";
import VaultZone from "./Vault/VaultZone";

const ZONES = {
  meadow: MeadowZone,
  diorama: DioramaZone,
  barBowling: BarBowlingZone,
  wordle: WordleZone,
  vault: VaultZone,
};

export default function ZoneManager() {
  const currentZone = useGameStore((s) => s.currentZone);
  const zoneToken = useGameStore((s) => s.zoneToken);
  const ZoneComponent = ZONES[currentZone] || MeadowZone;
  // key forces a clean remount (and instancedMesh/collider reset) every
  // time the zone changes — including the token, so jumping to the same
  // zone name twice in a row (e.g. two dev-tools checkpoints) still remounts.
  return <ZoneComponent key={`${currentZone}-${zoneToken}`} />;
}
