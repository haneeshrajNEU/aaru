import { useMemo } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const fragmentShader = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vWorldPosition;
void main() {
  float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
  gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
}
`;

// The "glass" of the snow globe — a huge inverted sphere rendered from the
// inside, standing in for a normal skybox so the world reads as an enclosed
// dome rather than an open horizon. Pass a pre-loaded equirectangular `map`
// texture for a painted sky instead of the default procedural gradient
// (the bottom gradient color should match the zone's fog color either way,
// so the seam disappears).
export default function SkyDome({ radius = 70, topColor = "#6a5a9c", bottomColor = "#cdd8e8", map }) {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color(topColor) },
      bottomColor: { value: new THREE.Color(bottomColor) },
      offset: { value: 10 },
      exponent: { value: 0.55 },
    }),
    [topColor, bottomColor]
  );

  return (
    <mesh renderOrder={-2}>
      <sphereGeometry args={[radius, 32, 16]} />
      {map ? (
        <meshBasicMaterial map={map} side={THREE.BackSide} depthWrite={false} fog={false} toneMapped={false} />
      ) : (
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={THREE.BackSide}
          depthWrite={false}
          fog={false}
        />
      )}
    </mesh>
  );
}
