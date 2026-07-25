import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGameStore } from "./store/useGameStore";
import { useUIStore } from "./store/useUIStore";
import { audioManager } from "./systems/audioManager";
import PlayerController from "./systems/PlayerController";
import GuideTrail from "./systems/GuideTrail";
import PostFX from "./systems/PostFX";
import ZoneManager from "./zones/ZoneManager";

import Modal from "./components/Modal";
import InventoryPanel from "./components/InventoryPanel";
import QuestTracker from "./components/QuestTracker";
import SettingsMenu from "./components/SettingsMenu";
import ControlHints from "./components/ControlHints";
import Crosshair from "./components/Crosshair";
import InteractPrompt from "./components/InteractPrompt";
import ToastStack from "./components/ToastStack";
import DialogueBox from "./components/DialogueBox";
import ClickToPlay from "./components/ClickToPlay";
import DioramaEditor from "./zones/DioramaRoom/DioramaEditor";
import BowlingAimUI from "./zones/BarBowling/BowlingAimUI";
import WordlePanel from "./zones/WordleRoom/WordlePanel";
import FinalLetterModal from "./components/FinalLetterModal";
import DevTools from "./systems/DevTools";

const ZONE_MUSIC = {
  meadow: "meadow",
  diorama: "diorama",
  barBowling: "bar",
  wordle: "wordle",
  vault: "bridge",
};

export default function App() {
  const currentZone = useGameStore((s) => s.currentZone);
  const transitioning = useGameStore((s) => s.transitioning);
  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const toggleSettings = useUIStore((s) => s.toggleSettings);
  const tipsy = useUIStore((s) => s.tipsy);
  const photoMode = useUIStore((s) => s.photoMode);

  useEffect(() => {
    audioManager.playZone(ZONE_MUSIC[currentZone] || "meadow");
  }, [currentZone]);

  useEffect(() => {
    const settings = useGameStore.getState().settings;
    audioManager.setMusicVolume(settings.musicVolume);
    audioManager.setSfxVolume(settings.sfxVolume);
  }, []);

  return (
    <>
      <div className={`canvas-wrap${tipsy ? " tipsy" : ""}`}>
        <Canvas
          camera={{ fov: 70, near: 0.1, far: 200 }}
          gl={{ antialias: true }}
          dpr={[1, 1.75]}
        >
          <Suspense fallback={null}>
            <ZoneManager />
            <GuideTrail />
            <PlayerController />
            <PostFX />
          </Suspense>
        </Canvas>
      </div>
      {tipsy && <div className="tipsy-tint" />}

      {!photoMode && (
        <div className="hud-root">
          <QuestTracker />
          <Crosshair />
          <InteractPrompt />
          <ToastStack />

          <div className="top-right-buttons">
            <button className="icon-button" onClick={toggleSettings} title="Settings">
              ⚙️
            </button>
          </div>
          {settingsOpen && <SettingsMenu />}
        </div>
      )}
      {photoMode && <div className="photo-mode-hint">Press ESC to continue</div>}

      {!photoMode && <ControlHints />}
      <DialogueBox />
      <Modal />
      <InventoryPanel />
      <DioramaEditor />
      <BowlingAimUI />
      <WordlePanel />
      <FinalLetterModal />
      <ClickToPlay onClick={() => useUIStore.getState().requestPointerLock()} />

      <div className="zone-fade" style={{ opacity: transitioning ? 1 : 0 }} />

      {import.meta.env.DEV && <DevTools />}
    </>
  );
}
