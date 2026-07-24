import { useUIStore } from "../store/useUIStore";

export default function DialogueBox() {
  const dialogue = useUIStore((s) => s.dialogue);
  const advanceDialogue = useUIStore((s) => s.advanceDialogue);

  if (!dialogue) return null;

  const isLast = dialogue.index === dialogue.lines.length - 1;

  return (
    <div className="dialogue-box" onClick={advanceDialogue}>
      {dialogue.speaker && <div className="speaker">{dialogue.speaker}</div>}
      <div className="line">{dialogue.lines[dialogue.index]}</div>
      <div className="continue-hint">
        {isLast ? "click / press E to close" : "click / press E to continue"}
      </div>
    </div>
  );
}
