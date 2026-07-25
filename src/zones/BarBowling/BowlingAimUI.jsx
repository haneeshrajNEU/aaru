import { useBowlingStore } from "../../store/useBowlingStore";
import { useUIStore } from "../../store/useUIStore";

export default function BowlingAimUI() {
  const open = useBowlingStore((s) => s.open);
  const mode = useBowlingStore((s) => s.mode);
  const aim = useBowlingStore((s) => s.aim);
  const power = useBowlingStore((s) => s.power);
  const setAim = useBowlingStore((s) => s.setAim);
  const setPower = useBowlingStore((s) => s.setPower);
  const close = useBowlingStore((s) => s.close);
  const bowl = useBowlingStore((s) => s.bowl);

  if (!open) return null;

  const closeAndResume = () => {
    close();
    useUIStore.getState().requestPointerLock();
  };

  const bowlAndResume = () => {
    bowl();
    useUIStore.getState().requestPointerLock();
  };

  return (
    <div className="side-panel-backdrop" onClick={closeAndResume}>
      <div className="side-panel" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === "haneesh" ? "Bowl at Haneesh" : "Take your shot"}</h2>
        <div className="modal-body">
          <p style={{ fontSize: 13, opacity: 0.75, marginTop: -6 }}>
            Watch the lane — the dotted line shows where this shot will land.
          </p>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Aim</div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.02"
              value={aim}
              onChange={(e) => setAim(parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Power</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={power}
              onChange={(e) => setPower(parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
            <div
              style={{
                marginTop: 8,
                height: 14,
                borderRadius: 999,
                background: "rgba(0,0,0,0.12)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${power * 100}%`,
                  background: "linear-gradient(90deg, #4ab8ff, #ffd966, #ff5a5a)",
                }}
              />
            </div>
          </div>
        </div>
        <div className="modal-actions" style={{ justifyContent: "space-between" }}>
          <button className="btn-primary" style={{ background: "#bbb", boxShadow: "none" }} onClick={closeAndResume}>
            Cancel
          </button>
          <button className="btn-primary" onClick={bowlAndResume}>
            Bowl!
          </button>
        </div>
      </div>
    </div>
  );
}
