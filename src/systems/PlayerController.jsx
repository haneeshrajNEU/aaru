import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { useLevelStore } from "../store/useLevelStore";
import { useUIStore } from "../store/useUIStore";
import { useDioramaEditStore } from "../store/useDioramaEditStore";
import { useBowlingStore } from "../store/useBowlingStore";
import { useWordleStore } from "../store/useWordleStore";
import { getInteractables } from "./interactables";
import { PLAYER_EYE_HEIGHT, PLAYER_MOVE_SPEED } from "../config/constants";

const PLAYER_RADIUS = 0.4;
const KEY_MAP = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "backward",
  ArrowDown: "backward",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

export default function PlayerController() {
  const { camera } = useThree();
  const controlsRef = useRef();
  const move = useRef({ forward: false, backward: false, left: false, right: false });
  const [locked, setLocked] = useState(false);

  const isPaused = () => {
    const ui = useUIStore.getState();
    return !!(
      ui.modal ||
      ui.inventoryOpen ||
      ui.settingsOpen ||
      ui.dialogue ||
      useDioramaEditStore.getState().activeIndex !== null ||
      useBowlingStore.getState().open ||
      useWordleStore.getState().open ||
      useUIStore.getState().letterOpen
    );
  };

  // Snap to spawn point whenever a new zone reports one.
  useEffect(
    () =>
      useLevelStore.subscribe((state, prevState) => {
        if (state.spawnToken !== prevState.spawnToken) {
          const { x, y, z, yaw } = state.spawn;
          camera.position.set(x, y + PLAYER_EYE_HEIGHT, z);
          camera.rotation.set(0, yaw, 0);
        }
      }),
    [camera]
  );

  useEffect(() => {
    const spawn = useLevelStore.getState().spawn;
    camera.position.set(spawn.x, spawn.y + PLAYER_EYE_HEIGHT, spawn.z);
    camera.rotation.set(0, spawn.yaw, 0);
  }, [camera]);

  useEffect(() => {
    const onKeyDown = (e) => {
      // The Wordle board owns the keyboard entirely while open (letters,
      // backspace, enter) so it doesn't fight with WASD/E/Tab handling here.
      if (useWordleStore.getState().open && e.code !== "Escape") return;

      if (KEY_MAP[e.code] && !isPaused()) move.current[KEY_MAP[e.code]] = true;

      if (e.code === "Tab") {
        e.preventDefault();
        useUIStore.getState().toggleInventory();
      } else if (e.code === "KeyI") {
        useUIStore.getState().toggleInventory();
      } else if (e.code === "Escape") {
        if (useUIStore.getState().inventoryOpen) useUIStore.getState().closeInventory();
        if (useUIStore.getState().settingsOpen) useUIStore.getState().toggleSettings();
        if (useWordleStore.getState().open) useWordleStore.getState().closeBoard();
        if (useUIStore.getState().photoMode) useUIStore.getState().setPhotoMode(false);
        if (useUIStore.getState().letterOpen) useUIStore.getState().closeLetter();
      } else if (e.code === "KeyE") {
        const ui = useUIStore.getState();
        if (ui.dialogue) {
          ui.advanceDialogue();
          return;
        }
        if (ui.modal || ui.inventoryOpen || ui.settingsOpen) return;
        if (ui.prompt?.onInteract) ui.prompt.onInteract();
      }
    };
    const onKeyUp = (e) => {
      if (KEY_MAP[e.code]) move.current[KEY_MAP[e.code]] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // The ClickToPlay HTML overlay lives outside the <Canvas>, so it can't
  // reach the PointerLockControls DOM listener directly — it bumps this
  // token instead and we react to it here.
  useEffect(
    () =>
      useUIStore.subscribe((state, prev) => {
        if (state.lockToken !== prev.lockToken && !isPaused()) {
          controlsRef.current?.lock();
        }
      }),
    []
  );

  // Release pointer lock whenever any overlay opens; clear keys so the
  // player doesn't keep "walking" while a modal is up.
  useEffect(
    () =>
      useUIStore.subscribe((state) => {
        const paused = !!(state.modal || state.inventoryOpen || state.settingsOpen || state.dialogue || state.letterOpen);
        if (paused && controlsRef.current?.isLocked) {
          controlsRef.current.unlock();
        }
        if (paused) {
          move.current = { forward: false, backward: false, left: false, right: false };
        }
      }),
    []
  );
  useEffect(
    () =>
      useDioramaEditStore.subscribe((state) => {
        if (state.activeIndex !== null && controlsRef.current?.isLocked) {
          controlsRef.current.unlock();
        }
      }),
    []
  );
  useEffect(
    () =>
      useBowlingStore.subscribe((state) => {
        if (state.open && controlsRef.current?.isLocked) {
          controlsRef.current.unlock();
        }
      }),
    []
  );
  useEffect(
    () =>
      useWordleStore.subscribe((state) => {
        if (state.open && controlsRef.current?.isLocked) {
          controlsRef.current.unlock();
        }
      }),
    []
  );

  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const nearest = useRef(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const level = useLevelStore.getState();

    if (locked && !isPaused()) {
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      right.set(-forward.z, 0, forward.x);

      const dir = new THREE.Vector3();
      if (move.current.forward) dir.add(forward);
      if (move.current.backward) dir.sub(forward);
      if (move.current.right) dir.add(right);
      if (move.current.left) dir.sub(right);

      if (dir.lengthSq() > 0) {
        dir.normalize().multiplyScalar(PLAYER_MOVE_SPEED * dt);
        let nx = camera.position.x + dir.x;
        let nz = camera.position.z + dir.z;

        for (const c of level.colliders) {
          const dx = nx - c.x;
          const dz = nz - c.z;
          const minDist = c.radius + PLAYER_RADIUS;
          const distSq = dx * dx + dz * dz;
          if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq) || 0.001;
            const push = minDist - dist;
            nx += (dx / dist) * push;
            nz += (dz / dist) * push;
          }
        }

        nx = THREE.MathUtils.clamp(nx, level.bounds.minX, level.bounds.maxX);
        nz = THREE.MathUtils.clamp(nz, level.bounds.minZ, level.bounds.maxZ);

        camera.position.x = nx;
        camera.position.z = nz;
      }
    }
    camera.position.y = level.spawn.y + PLAYER_EYE_HEIGHT;

    // Find nearest interactable and publish a prompt for the UI + E key.
    let bestId = null;
    let bestDist = Infinity;
    for (const [id, entry] of getInteractables()) {
      const p = entry.getPosition();
      const dx = p.x - camera.position.x;
      const dz = p.z - camera.position.z;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d < entry.radius && d < bestDist) {
        bestDist = d;
        bestId = id;
      }
    }
    if (bestId !== nearest.current) {
      nearest.current = bestId;
      const entry = bestId ? getInteractables().get(bestId) : null;
      useUIStore
        .getState()
        .setPrompt(entry ? { label: entry.label, onInteract: entry.onInteract } : null);
    }
  });

  return (
    <>
      <PointerLockControls
        ref={controlsRef}
        onLock={() => {
          setLocked(true);
          useUIStore.getState().setPointerLocked(true);
        }}
        onUnlock={() => {
          setLocked(false);
          useUIStore.getState().setPointerLocked(false);
        }}
      />
    </>
  );
}
