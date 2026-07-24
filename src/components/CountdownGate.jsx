import { useEffect, useState } from "react";
import { LAUNCH_AT_ISO } from "../config/constants";

const launchTime = new Date(LAUNCH_AT_ISO).getTime();

function getRemaining() {
  return Math.max(0, launchTime - Date.now());
}

function splitDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (n) => String(n).padStart(2, "0");

// Withholds the game entirely (the 3D scene never even mounts) until
// LAUNCH_AT_ISO. Purely client-clock based — fine for a personal gift link,
// not meant to resist someone deliberately messing with their system clock.
export default function CountdownGate({ children }) {
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    if (remaining <= 0) return undefined;
    const id = setInterval(() => {
      const next = getRemaining();
      setRemaining(next);
      if (next <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining <= 0) return children;

  const { days, hours, minutes, seconds } = splitDuration(remaining);

  return (
    <div className="countdown-screen">
      <div className="countdown-card">
        <h1>Not yet</h1>
        <p>This little world isn't ready for you yet. Come back soon.</p>
        <div className="countdown-grid">
          <div className="countdown-unit">
            <span className="num">{days}</span>
            <span className="label">{days === 1 ? "day" : "days"}</span>
          </div>
          <div className="countdown-unit">
            <span className="num">{pad(hours)}</span>
            <span className="label">hours</span>
          </div>
          <div className="countdown-unit">
            <span className="num">{pad(minutes)}</span>
            <span className="label">minutes</span>
          </div>
          <div className="countdown-unit">
            <span className="num">{pad(seconds)}</span>
            <span className="label">seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
