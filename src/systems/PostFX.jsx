import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function PostFX() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.58}
        luminanceSmoothing={0.3}
        mipmapBlur
        radius={0.85}
      />
      <Vignette eskil={false} offset={0.15} darkness={0.4} />
    </EffectComposer>
  );
}
