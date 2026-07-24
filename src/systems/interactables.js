// Lightweight imperative registry for "walk up + press E" interactables.
// Kept outside React state since it's read every frame by the controller.
const registry = new Map();

let nextId = 0;

// entry: { getPosition: () => {x,y,z}, label: string, radius?: number, onInteract: () => void }
export function registerInteractable(entry) {
  const id = `int_${nextId++}`;
  registry.set(id, { radius: 2.2, ...entry });
  return () => registry.delete(id);
}

export function getInteractables() {
  return registry;
}
