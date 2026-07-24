import { useUIStore } from "../store/useUIStore";

export default function Crosshair() {
  const pointerLocked = useUIStore((s) => s.pointerLocked);
  if (!pointerLocked) return null;
  return <div className="crosshair" />;
}
