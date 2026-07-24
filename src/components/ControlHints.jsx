import { useEffect, useState } from "react";
import { useUIStore } from "../store/useUIStore";

export default function ControlHints() {
  const [visible, setVisible] = useState(false);
  const pointerLocked = useUIStore((s) => s.pointerLocked);

  useEffect(() => {
    if (!pointerLocked) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 7000);
    return () => clearTimeout(t);
  }, [pointerLocked]);

  if (!visible) return null;

  return (
    <div className="control-hints">
      <span>
        <kbd>W A S D</kbd>move
      </span>
      <span>
        <kbd>mouse</kbd>look
      </span>
      <span>
        <kbd>E</kbd>interact
      </span>
      <span>
        <kbd>I</kbd>inventory
      </span>
    </div>
  );
}
