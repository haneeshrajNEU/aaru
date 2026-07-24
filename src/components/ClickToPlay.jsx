import { useUIStore } from "../store/useUIStore";
import { useDioramaEditStore } from "../store/useDioramaEditStore";
import { useBowlingStore } from "../store/useBowlingStore";
import { useWordleStore } from "../store/useWordleStore";

export default function ClickToPlay({ onClick }) {
  const pointerLocked = useUIStore((s) => s.pointerLocked);
  const modal = useUIStore((s) => s.modal);
  const inventoryOpen = useUIStore((s) => s.inventoryOpen);
  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const dialogue = useUIStore((s) => s.dialogue);
  const dioramaEditing = useDioramaEditStore((s) => s.activeIndex !== null);
  const bowlingOpen = useBowlingStore((s) => s.open);
  const wordleOpen = useWordleStore((s) => s.open);
  const letterOpen = useUIStore((s) => s.letterOpen);

  if (
    pointerLocked ||
    modal ||
    inventoryOpen ||
    settingsOpen ||
    dialogue ||
    dioramaEditing ||
    bowlingOpen ||
    wordleOpen ||
    letterOpen
  )
    return null;

  return (
    <div className="click-to-play" onClick={onClick}>
      <div className="big">click to look around</div>
      <div className="small">WASD to move · E to interact · I for satchel</div>
    </div>
  );
}
