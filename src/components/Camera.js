import * as THREE from "three";

const size = 300;
const targetAspect = 16 / 9;

function getCameraSize() {
  const isPortraitMobile =
    window.innerHeight > window.innerWidth &&
    window.matchMedia("(pointer: coarse)").matches;

  const aspect = isPortraitMobile
    ? targetAspect
    : window.innerWidth / window.innerHeight;

  const width = size * Math.max(aspect, targetAspect);
  const height = width / aspect;

  return { width, height };
}

export function Camera() {
  const { width, height } = getCameraSize();

  const camera = new THREE.OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    100,
    2000,
  );

  camera.up.set(0, 0, 1);
  camera.position.set(300, -300, 300);
  camera.lookAt(0, 0, 0);

  return camera;
}

export function updateCamera(camera) {
  const { width, height } = getCameraSize();

  camera.left = -width / 2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = -height / 2;

  camera.updateProjectionMatrix();
}
