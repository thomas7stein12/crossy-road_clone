import * as THREE from "three";
import { Renderer } from "./components/Renderer.js";
import { Camera, updateCamera } from "./components/Camera.js";
import { DirectionalLight } from "./components/DirectionalLight.js";
import { player, initializePlayer } from "./components/Player.js";
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

initializeGame();

document.querySelector("#retry")?.addEventListener("click", initializeGame);

function initializeGame() {
  initializePlayer();
  initializeMap();

  if (scoreDOM) scoreDOM.innerText = "0";
  if (resultDOM) resultDOM.style.visibility = "hidden";
}

const renderer = Renderer();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateCamera(camera);
});

renderer.setAnimationLoop(animate);

function animate() {
  animateVehicles();
  animatePlayer();
  hitTest(scene);
  animateParticleBursts();

  renderer.render(scene, camera);
}
