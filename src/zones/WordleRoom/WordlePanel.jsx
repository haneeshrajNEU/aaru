import { useEffect } from "react";
import { useWordleStore } from "../../store/useWordleStore";
import { useUIStore } from "../../store/useUIStore";
import { audioManager } from "../../systems/audioManager";
import { PLAYER_NAME } from "../../config/constants";
import { TARGET_WORD } from "../../config/constants";

const KEY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
];

const ROWS_BEFORE_HINT = 4;

export default function WordlePanel() {
  const open = useWordleStore((s) => s.open);
  const current = useWordleStore((s) => s.current);
  const guesses = useWordleStore((s) => s.guesses);
  const solved = useWordleStore((s) => s.solved);
  const typeLetter = useWordleStore((s) => s.typeLetter);
  const backspace = useWordleStore((s) => s.backspace);
  const submitGuess = useWordleStore((s) => s.submitGuess);
  const closeBoard = useWordleStore((s) => s.closeBoard);
  const letterStatuses = useWordleStore((s) => s.letterStatuses)();

  const handleKey = (key) => {
    if (solved) return;
    if (key === "ENTER") {
      if (current.length === 5) {
        const didSolve = submitGuess();
        audioManager.play(didSolve ? "correct" : "wrong");
      }
    } else if (key === "BACK") {
      backspace();
    } else if (/^[A-Z]$/.test(key)) {
      typeLetter(key);
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.code === "Enter") handleKey("ENTER");
      else if (e.code === "Backspace") handleKey("BACK");
      else if (/^Key[A-Z]$/.test(e.code)) handleKey(e.code.slice(3));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, current, solved]);

  if (!open) return null;

  const closeAndResume = () => {
    closeBoard();
    useUIStore.getState().requestPointerLock();
  };

  const displayRows = [...guesses.map((g) => ({ letters: g.word.split(""), feedback: g.feedback }))];
  if (!solved) displayRows.push({ letters: current.split(""), feedback: null, active: true });
  const totalRows = Math.max(6, displayRows.length + 1);
  while (displayRows.length < totalRows) displayRows.push({ letters: [], feedback: null });

  const showHint = !solved && guesses.length >= ROWS_BEFORE_HINT;

  return (
    <div className="modal-backdrop" onClick={closeAndResume}>
      <div className="modal-card wordle-card" onClick={(e) => e.stopPropagation()}>
        <h2>The Puzzle Room</h2>
        {solved ? (
          <div className="modal-body" style={{ textAlign: "center" }}>
            <p style={{ fontSize: 18 }}>Solved it, {PLAYER_NAME}! ✨</p>
            <button className="btn-primary" onClick={closeAndResume} style={{ marginTop: 10 }}>
              Continue
            </button>
          </div>
        ) : (
          <>
            {showHint && (
              <div className="wordle-hint">Hint: the word starts with "{TARGET_WORD[0]}"</div>
            )}
            <div className="wordle-grid">
              {displayRows.map((row, ri) => (
                <div className="wordle-row" key={ri}>
                  {Array.from({ length: 5 }).map((_, ci) => {
                    const letter = row.letters[ci] || "";
                    const status = row.feedback ? row.feedback[ci] : null;
                    return (
                      <div key={ci} className={`wordle-tile ${status || ""} ${letter ? "filled" : ""}`}>
                        {letter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="wordle-keyboard">
              {KEY_ROWS.map((row, ri) => (
                <div className="wordle-key-row" key={ri}>
                  {row.map((key) => {
                    const status = key.length === 1 ? letterStatuses[key] : null;
                    const wide = key === "ENTER" || key === "BACK";
                    return (
                      <button
                        key={key}
                        className={`wordle-key ${status || ""} ${wide ? "wide" : ""}`}
                        onClick={() => handleKey(key)}
                      >
                        {key === "BACK" ? "⌫" : key}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="close-hint">Esc to step away — your progress this visit is kept</div>
          </>
        )}
      </div>
    </div>
  );
}
