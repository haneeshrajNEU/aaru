import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { useUIStore } from "../store/useUIStore";
import { ITEMS, ITEM_ORDER } from "../config/items";
import { PLAYER_NAME } from "../config/constants";
import { audioManager } from "../systems/audioManager";

export default function InventoryPanel() {
  const inventoryOpen = useUIStore((s) => s.inventoryOpen);
  const closeInventory = useUIStore((s) => s.closeInventory);
  const inventory = useGameStore((s) => s.inventory);

  if (!inventoryOpen) return null;

  return (
    <div className="inventory-panel">
      <h2>{PLAYER_NAME}'s Satchel</h2>
      <div className="sub">Everything gathered so far.</div>
      <div className="inventory-grid">
        {ITEM_ORDER.map((id) => (
          <Slot key={id} id={id} collected={inventory.includes(id)} />
        ))}
      </div>
      <div className="close-hint">Press Tab / I / Esc to close</div>
      <div style={{ position: "absolute", top: 14, right: 18 }}>
        <button className="icon-button" style={{ width: 32, height: 32, fontSize: 14 }} onClick={closeInventory}>
          ✕
        </button>
      </div>
    </div>
  );
}

function Slot({ id, collected }) {
  const item = ITEMS[id];
  if (!collected) {
    return (
      <div className="inventory-slot empty">
        <div className="icon">?</div>
        <div className="name">???</div>
      </div>
    );
  }

  return (
    <div className="inventory-slot">
      <div className="tooltip">{item.flavor}</div>
      <div className="icon">{item.icon}</div>
      <div className="name">{item.name}</div>
      {id === "musicDisc" && <MusicDiscPlayer />}
    </div>
  );
}

function MusicDiscPlayer() {
  const [playing, setPlaying] = useState(false);
  const howlRef = useRef(null);

  useEffect(() => {
    howlRef.current = audioManager.getMusicDiscHowl();
    return () => {
      howlRef.current?.pause();
    };
  }, []);

  const toggle = (e) => {
    e.stopPropagation();
    const howl = howlRef.current;
    if (!howl) return;
    if (playing) {
      howl.pause();
      setPlaying(false);
    } else {
      howl.play();
      setPlaying(true);
    }
  };

  return (
    <div className={`disc-player ${playing ? "playing" : ""}`}>
      <div className="record" />
      <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
}
