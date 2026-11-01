import * as THREE from "three";

const targetAspect = 16 / 9;

function getViewportSize() {
  const width = window.innerWidth;

  const isPortraitMobile =
    window.innerHeight > window.innerWidth &&
    window.matchMedia("(pointer: coarse)").matches;

  // Keep the game at 16:9 on portrait mobile screens
  const height = isPortraitMobile ? width / targetAspect : window.innerHeight;

  // Leave room for the mobile controls
  const reservedControlHeight = 190;

  const top = isPortraitMobile
    ? Math.max(8, (window.innerHeight - reservedControlHeight - height) / 2)
    : 0;

  return {
    width,
    height,
    top,
    isPortraitMobile,
  };
}

export function resizeRenderer(renderer) {
  const { width, height, top, isPortraitMobile } = getViewportSize();

  renderer.setSize(width, height);

  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.top = `${top}px`;

  // Let the score follow the game viewport
  document.documentElement.style.setProperty("--game-top", `${top}px`);

  document.body.classList.toggle("portrait-mobile", isPortraitMobile);
}

export function Renderer() {
  const canvas = document.querySelector("canvas.game");
  if (!canvas) throw new Error("Canvas not found");

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
  });

  // Avoid rendering unnecessarily large images on high-resolution phones
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.shadowMap.enabled = true;

  resizeRenderer(renderer);

  return renderer;
}
