import { useState } from "react";
import { GATE_PASSWORD } from "../config/constants";

const STORAGE_KEY = "sunflower-gate-unlocked";

// Withholds the whole game (nothing mounts, not even the countdown) until
// the right word is entered. Purely client-side, remembers success in
// localStorage so it only has to be entered once per device.
export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  if (unlocked) return children;

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim().toLowerCase() === GATE_PASSWORD.toLowerCase()) {
      localStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setWrong(true);
      setValue("");
    }
  }

  return (
    <div className="password-screen">
      <form className="password-card" onSubmit={handleSubmit}>
        <h1>Password, please</h1>
        <p>You know what it is.</p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setWrong(false);
          }}
          placeholder="..."
        />
        <button type="submit">Enter</button>
        {wrong && <p className="password-error">Nope, try again.</p>}
      </form>
    </div>
  );
}
