import { useEffect, useRef, useState } from "react";
import { useBowlingStore } from "../../store/useBowlingStore";
import { useUIStore } from "../../store/useUIStore";

export default function BowlingAimUI() {
  const open = useBowlingStore((s) => s.open);
  const mode = useBowlingStore((s) => s.mode);
  const aim = useBowlingStore((s) => s.aim);
  const setAim = useBowlingStore((s) => s.setAim);
  const close = useBowlingStore((s) => s.close);
  const bowl = useBowlingStore((s) => s.bowl);

  const [power, setPower] = useState(0);
  const rafRef = useRef();
  const startRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    startRef.current = performance.now();
    const tick = (now) => {
      const t = (now - startRef.current) / 900;
      const p = (Math.sin(t * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      setPower(p);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [open]);

  if (!open) return null;

  const closeAndResume = () => {
    close();
    useUIStore.getState().requestPointerLock();
  };

  const bowlAndResume = () => {
    bowl(power);
    useUIStore.getState().requestPointerLock();
  };

  return (
    <div className="modal-backdrop" onClick={closeAndResume}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: "min(440px, 90vw)" }}>
        <h2>{mode === "haneesh" ? "Bowl at Haneesh" : "Take your shot"}</h2>
        <div className="modal-body">
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
            <div style={{ fontSize: 13, marginBottom: 6 }}>Power — click Bowl at the right moment</div>
            <div
              style={{
                height: 18,
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
                  background: "linear-gradient(90deg, #8fd19e, #ffd966, #ff8c42)",
                  transition: "width 0.05s linear",
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
