import { useGameStore } from "../store/useGameStore";
import { useUIStore } from "../store/useUIStore";
import { audioManager } from "../systems/audioManager";

export default function SettingsMenu() {
  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const settings = useGameStore((s) => s.settings);
  const toggleGuide = useGameStore((s) => s.toggleGuide);
  const setVolume = useGameStore((s) => s.setVolume);

  if (!settingsOpen) return null;

  const onMusic = (e) => {
    const v = parseFloat(e.target.value);
    setVolume("musicVolume", v);
    audioManager.setMusicVolume(v);
  };
  const onSfx = (e) => {
    const v = parseFloat(e.target.value);
    setVolume("sfxVolume", v);
    audioManager.setSfxVolume(v);
  };

  return (
    <div className="settings-panel">
      <h3>Settings</h3>
      <div className="settings-row">
        <span>Guide trail</span>
        <button
          className={`toggle ${settings.guideEnabled ? "on" : ""}`}
          onClick={toggleGuide}
          aria-label="Toggle guide trail"
        />
      </div>
      <div className="settings-row">
        <span>Music</span>
        <input type="range" min="0" max="1" step="0.05" value={settings.musicVolume} onChange={onMusic} />
      </div>
      <div className="settings-row">
        <span>Sound FX</span>
        <input type="range" min="0" max="1" step="0.05" value={settings.sfxVolume} onChange={onSfx} />
      </div>
    </div>
  );
}
