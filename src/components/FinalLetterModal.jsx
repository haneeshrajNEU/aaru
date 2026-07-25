import { useMemo } from "react";
import { useUIStore } from "../store/useUIStore";
import { BIRTHDAY_LETTER } from "../config/constants";

const PETAL_COLORS = ["#ffc1cc", "#ffd966", "#d9c9f0", "#bfd7ff"];

export default function FinalLetterModal() {
  const open = useUIStore((s) => s.letterOpen);
  const close = useUIStore((s) => s.closeLetter);

  const petals = useMemo(
    () =>
      new Array(18).fill(0).map((_, i) => ({
        left: Math.round(Math.random() * 100),
        delay: (Math.random() * 6).toFixed(2),
        duration: (7 + Math.random() * 6).toFixed(2),
        size: 8 + Math.round(Math.random() * 10),
        color: PETAL_COLORS[i % PETAL_COLORS.length],
      })),
    []
  );

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="petal-field">
        {petals.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
      <div className="letter-card" onClick={(e) => e.stopPropagation()}>
        <div className="letter-content">
          <h2>{BIRTHDAY_LETTER.heading}</h2>
          <div className="letter-body">{BIRTHDAY_LETTER.body}</div>
          <div className="signoff">{BIRTHDAY_LETTER.signoff}</div>
          <div className="modal-actions">
            <button className="btn-primary" onClick={close}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
