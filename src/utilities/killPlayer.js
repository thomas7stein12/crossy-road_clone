import * as THREE from "three";
import { player, position, movesQueue } from "../components/Player.js";

import { stopPlayerAnimation } from "../animatePlayer.js";
import { createParticleBurst } from "../effects/ParticleBurst.js";

const resultDOM = document.getElementById("result-container");
const finalScoreDOM = document.getElementById("final-score");

export function killPlayer(scene, color = 0xd62828) {
  const playerModel = player.children[0];

  // Prevent multiple death animations
  if (!playerModel.visible) return;

  movesQueue.length = 0;
  stopPlayerAnimation();

  const burstPosition = new THREE.Vector3(
    player.position.x,
    player.position.y,
    playerModel.position.z + 13,
  );

  // Hide the player
  playerModel.visible = false;

  // Create the particle effect
  createParticleBurst(scene, burstPosition, color);

  // Show the game-over screen
  if (resultDOM) resultDOM.style.visibility = "visible";

  if (finalScoreDOM) {
    finalScoreDOM.innerText = position.currentRow.toString();
  }
}
