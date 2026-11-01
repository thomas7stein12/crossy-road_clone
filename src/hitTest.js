import * as THREE from "three";
import { metadata as rows } from "./components/Map.js";
import { player, position } from "./components/Player.js";
import { tileSize } from "./constants.js";
import { isPlayerMoving } from "./animatePlayer.js";
import { killPlayer } from "./utilities/killPlayer.js";

const playerHalfWidth = 7.5;
const waterColor = 0x2196f3;

function isSupportedByWater(row) {
  const playerX = player.position.x;

  // Check whether a log is underneath the player
  const onLog = row.logs.some((log) => {
    if (!log.ref) return false;

    const halfLength = (log.lengthInTiles * tileSize) / 2;

    return (
      Math.abs(playerX - log.ref.position.x) <= halfLength + playerHalfWidth
    );
  });

  // Check whether the player is on a stationary lily pad
  const onLilyPad = row.lilyPads.some((pad) => {
    const padX = pad.tileIndex * tileSize;

    return Math.abs(playerX - padX) <= pad.radius + playerHalfWidth;
  });

  return onLog || onLilyPad;
}

export function hitTest(scene) {
  const row = rows[position.currentRow - 1];

  if (!row) return;

  // WATER COLLISION
  if (row.type === "water") {
    // Don't check support during a jump
    if (isPlayerMoving()) return;

    if (!isSupportedByWater(row)) {
      killPlayer(scene, waterColor);
    }

    return;
  }

  // VEHICLE COLLISION
  // VEHICLE COLLISION
  if (row.type === "car" || row.type === "truck" || row.type === "train") {
    const playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(player);

    // Trains have one reference; cars and trucks have multiple
    const vehicleRefs =
      row.type === "train" ? [row.ref] : row.vehicles.map(({ ref }) => ref);

    for (const ref of vehicleRefs) {
      if (!ref) throw Error("Vehicle reference is missing");

      const vehicleBoundingBox = new THREE.Box3();
      vehicleBoundingBox.setFromObject(ref);

      if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
        killPlayer(scene);
        return;
      }
    }
  }
}
