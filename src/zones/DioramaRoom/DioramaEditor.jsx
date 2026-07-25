import { useDioramaEditStore, angularDistance } from "../../store/useDioramaEditStore";
import { useUIStore } from "../../store/useUIStore";
import { audioManager } from "../../systems/audioManager";

export default function DioramaEditor() {
  const activeIndex = useDioramaEditStore((s) => s.activeIndex);
  const rotation = useDioramaEditStore((s) => s.rotation);
  const scale = useDioramaEditStore((s) => s.scale);
  const correctRotation = useDioramaEditStore((s) => s.correctRotation);
  const correctScale = useDioramaEditStore((s) => s.correctScale);
  const onSolved = useDioramaEditStore((s) => s.onSolved);
  const setRotation = useDioramaEditStore((s) => s.setRotation);
  const setScale = useDioramaEditStore((s) => s.setScale);
  const close = useDioramaEditStore((s) => s.close);

  if (activeIndex === null) return null;

  const rotAligned = angularDistance(rotation, correctRotation) < 8;
  const scaleAligned = Math.abs(scale - correctScale) < 0.06;
  const aligned = rotAligned && scaleAligned;

  const closeAndResume = () => {
    close();
    useUIStore.getState().requestPointerLock();
  };

  const lockIn = () => {
    if (!aligned) return;
    audioManager.play("clink");
    onSolved?.();
    closeAndResume();
  };

  return (
    <div className="side-panel-backdrop" onClick={closeAndResume}>
      <div className="side-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Nudge it into place</h2>
        <div className="modal-body">
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
              <span>Rotation</span>
              <span style={{ color: rotAligned ? "#4a9b4a" : "#a35d1f" }}>{rotAligned ? "aligned!" : "keep turning"}</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
              <span>Scale</span>
              <span style={{ color: scaleAligned ? "#4a9b4a" : "#a35d1f" }}>{scaleAligned ? "aligned!" : "getting there"}</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.4"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div className="modal-actions" style={{ justifyContent: "space-between" }}>
          <button className="btn-primary" style={{ background: "#bbb", boxShadow: "none" }} onClick={closeAndResume}>
            Later
          </button>
          <button
            className="btn-primary"
            disabled={!aligned}
            style={!aligned ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
            onClick={lockIn}
          >
            Lock it in
          </button>
        </div>
      </div>
    </div>
  );
}
