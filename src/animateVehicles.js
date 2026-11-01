import * as THREE from "three";
import { metadata as rows } from "./components/Map.js";
import { player } from "./components/Player.js";

const clock = new THREE.Clock();

const cameraSize = 300;
const targetAspect = 16 / 9;
const offscreenPadding = 100;

function getVisibleXBounds() {
  const aspect = window.innerWidth / window.innerHeight;

  const cameraWidth = cameraSize * Math.max(aspect, targetAspect);

  const cameraHeight = cameraWidth / aspect;

  // Account for the angled camera when calculating
  // how far the world extends horizontally on screen.
  const horizontalLimit = cameraWidth / Math.sqrt(2);
  const verticalLimit = (cameraHeight * Math.sqrt(6)) / 2;

  const halfVisibleWidth = Math.min(horizontalLimit, verticalLimit);

  const halfRange = halfVisibleWidth + offscreenPadding;

  return {
    left: player.position.x - halfRange,
    right: player.position.x + halfRange,
  };
}

export function animateVehicles() {
  const delta = clock.getDelta();

  const { left, right } = getVisibleXBounds();

  rows.forEach((rowData) => {
    // Animate water logs
    if (rowData.type === "water") {
      const movement = rowData.direction ? 1 : -1;

      rowData.logs.forEach((logData) => {
        const ref = logData.ref;

        if (!ref) throw Error("Log reference is missing");

        const halfLength = (logData.lengthInTiles * 42) / 2;

        const nextX = ref.position.x + movement * rowData.speed * delta;

        // Wait until the ENTIRE log is off-screen
        if (movement > 0 && nextX - halfLength > right) {
          ref.position.x = left - halfLength;
        } else if (movement < 0 && nextX + halfLength < left) {
          ref.position.x = right + halfLength;
        } else {
          ref.position.x = nextX;
        }
      });

      return;
    }

    // Animate trains
    if (rowData.type === "train") {
      const ref = rowData.ref;

      if (!ref) throw Error("Train reference is missing");

      const movement = rowData.direction ? 1 : -1;
      const halfLength = rowData.length / 2;

      // Spawn completely outside the camera view
      const spawnX = movement > 0 ? left - halfLength : right + halfLength;

      // First initialization
      if (!rowData.started) {
        ref.position.x = spawnX;
        rowData.started = true;
        return;
      }

      // Wait three seconds after the entire train exits
      if (rowData.waitingToRespawn) {
        rowData.respawnTimer -= delta;

        if (rowData.respawnTimer <= 0) {
          ref.position.x = spawnX;
          rowData.waitingToRespawn = false;
        }

        return;
      }

      const nextX = ref.position.x + movement * rowData.speed * delta;

      // Check whether the entire train has left the view
      const hasClearedView =
        movement > 0 ? nextX - halfLength > right : nextX + halfLength < left;

      ref.position.x = nextX;

      if (hasClearedView) {
        rowData.waitingToRespawn = true;
        rowData.respawnTimer = 3;
      }

      return;
    }

    // Existing car and truck animation
    if (rowData.type !== "car" && rowData.type !== "truck") {
      return;
    }

    const halfLength = rowData.type === "car" ? 30 : 50;

    rowData.vehicles.forEach(({ ref }) => {
      if (!ref) throw Error("Vehicle reference is missing");

      const movement = rowData.direction ? 1 : -1;

      const nextX = ref.position.x + movement * rowData.speed * delta;

      // Only wrap after the complete vehicle leaves the view
      if (movement > 0 && nextX - halfLength > right) {
        ref.position.x = left - halfLength;
      } else if (movement < 0 && nextX + halfLength < left) {
        ref.position.x = right + halfLength;
      } else {
        ref.position.x = nextX;
      }
    });
  });
}
