import { useGameStore } from "../store/useGameStore";

export default function QuestTracker() {
  const questText = useGameStore((s) => s.questText);
  if (!questText) return null;
  return (
    <div className="quest-tracker">
      <div className="label">Quest</div>
      <div>{questText}</div>
    </div>
  );
}
