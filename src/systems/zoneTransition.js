import { useGameStore } from "../store/useGameStore";

const FADE_MS = 550;

// Fade to black, swap the active zone + quest text, fade back in.
export function transitionToZone(zone, questText) {
  const store = useGameStore.getState();
  store.setTransitioning(true);
  setTimeout(() => {
    store.setZone(zone);
    if (questText) store.setQuest(questText);
    setTimeout(() => useGameStore.getState().setTransitioning(false), 80);
  }, FADE_MS);
}
