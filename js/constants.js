import * as THREE from "three";

// SCREEN
export const SCREEN_SIZES = {
  width: window.innerWidth,
  height: window.innerHeight
};

// CAMERA
export const CAMERA_FOV = 30;
export const CAMERA_FOV_RADIANS = CAMERA_FOV * (Math.PI / 180);
export const CAMERA_OFFSET = 1.5;

// GRADIENT MAP
export function createGradientMap(format, numberOfColors) {
  const colors = new Uint8Array(numberOfColors);

  for (let c = 0; c <= colors.length; c++) {
    colors[c] = (c / colors.length) * 256;
  }

  const gradientMap = new THREE.DataTexture(colors, colors.length, 1, format);
  gradientMap.needsUpdate = true;

  return gradientMap;
}
