import * as THREE from "three";
import { Renderer } from "./components/Renderer.js";
import { Camera, updateCamera } from "./components/Camera.js";
import { DirectionalLight } from "./components/DirectionalLight.js";
import {
  player,
  initializePlayer,
  setGameStarted,
  isGameStarted,
} from "./components/Player.js";
import { map, initializeMap } from "./components/Map.js";
import { animateVehicles } from "./animateVehicles.js";
import { animatePlayer } from "./animatePlayer.js";
import { hitTest } from "./hitTest.js";
import { animateParticleBursts } from "./effects/ParticleBurst.js";
import "./style.css";
import "./collectUserInput.js";

const scene = new THREE.Scene();
scene.add(player);
scene.add(map);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const dirLight = DirectionalLight();
dirLight.target = player;
player.add(dirLight);

const camera = Camera();
player.add(camera);

const scoreDOM = document.getElementById("score");
const resultDOM = document.getElementById("result-container");
const startDOM = document.getElementById("start-container");

initializeGame();

document.querySelector("#retry")?.addEventListener("click", () => {
  initializeGame(true);
});

// Initialize or restart the game
function initializeGame(startImmediately = false) {
  initializePlayer();
  initializeMap();

  if (scoreDOM) scoreDOM.innerText = "0";
  if (resultDOM) resultDOM.style.visibility = "hidden";

  // Show the starting screen unless we're restarting
  if (startDOM) {
    startDOM.style.visibility = startImmediately ? "hidden" : "visible";
  }

  document.body.classList.toggle("game-not-started", !startImmediately);

  setGameStarted(startImmediately);
}

// Handle starting and restarting with Space
window.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.repeat) return;

  event.preventDefault();

  // Restart after dying
  if (resultDOM?.style.visibility === "visible") {
    initializeGame(true);
    return;
  }

  // Start the game for the first time
  if (!isGameStarted()) {
    setGameStarted(true);

    if (startDOM) startDOM.style.visibility = "hidden";

    document.body.classList.remove("game-not-started");
  }
});

const renderer = Renderer();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateCamera(camera);
});

renderer.setAnimationLoop(animate);

function animate() {
  // Only run gameplay after the player starts
  if (isGameStarted()) {
    animateVehicles();
    animatePlayer();
    hitTest(scene);
  }

  animateParticleBursts();

  renderer.render(scene, camera);
}
