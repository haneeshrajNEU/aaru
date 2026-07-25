import * as THREE from "three";

// Shared by the live trajectory preview and the actual roll animation so
// the preview always predicts exactly where the ball will end up.
export const ROLL_DISTANCE = 6.6;

export function computeFinalX(aim, power) {
  return THREE.MathUtils.clamp(aim * 1.5 + (power - 0.5) * 0.4, -0.9, 0.9);
}

export function computeKnockRadius(power) {
  return 0.32 + power * 0.6;
}

// Higher power = a faster (shorter-duration) roll, so the power slider
// actually changes how fast the ball visibly moves down the lane.
export function computeRollMs(power) {
  return 1500 - power * 800;
}
