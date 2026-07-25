import * as THREE from "three";

// Pass as the second arg to drei's useTexture to make a diffuse map repeat
// instead of stretching once across a whole floor/wall.
export function tileTexture(repeatX = 1, repeatY = 1) {
  return (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
  };
}
