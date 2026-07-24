import * as THREE from "three";

let sharedMap = null;

// A small stepped gradient texture used with MeshToonMaterial to get the
// flat cel-shaded banding look instead of smooth Lambert shading.
export function getToonGradientMap() {
  if (sharedMap) return sharedMap;
  const steps = 4;
  const data = new Uint8Array(steps);
  for (let i = 0; i < steps; i++) {
    data[i] = Math.round((i / (steps - 1)) * 255);
  }
  const texture = new THREE.DataTexture(data, steps, 1, THREE.RedFormat);
  texture.needsUpdate = true;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  sharedMap = texture;
  return texture;
}
