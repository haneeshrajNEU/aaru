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
  const ZoneComponent = ZONES[currentZone] || MeadowZone;
  // key forces a clean remount (and instancedMesh/collider reset) per zone.
  return <ZoneComponent key={currentZone} />;
}
