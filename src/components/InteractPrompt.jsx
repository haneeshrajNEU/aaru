import { useUIStore } from "../store/useUIStore";

export default function InteractPrompt() {
  const prompt = useUIStore((s) => s.prompt);
  const pointerLocked = useUIStore((s) => s.pointerLocked);
  if (!prompt || !pointerLocked) return null;
  return (
    <div className="interact-prompt">
      <kbd>E</kbd>
      {prompt.label}
    </div>
  );
}
