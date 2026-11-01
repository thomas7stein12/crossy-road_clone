import * as THREE from "three";
import { metadata as rows } from "./components/Map.js";
import { minTileIndex, maxTileIndex, tileSize } from "./constants.js";

const clock = new THREE.Clock();

export function animateVehicles() {
  const delta = clock.getDelta();

  rows.forEach((rowData) => {
    const beginningOfRow = (minTileIndex - 2) * tileSize;
    const endOfRow = (maxTileIndex + 2) * tileSize;

    // Animate water logs
    if (rowData.type === "water") {
      const movement = rowData.direction ? 1 : -1;

      rowData.logs.forEach((logData) => {
        const ref = logData.ref;

        if (!ref) throw Error("Log reference is missing");

        const halfLength = (logData.lengthInTiles * tileSize) / 2;

        const nextX = ref.position.x + movement * rowData.speed * delta;

        if (movement > 0 && nextX - halfLength > endOfRow) {
          ref.position.x = beginningOfRow - halfLength;
        } else if (movement < 0 && nextX + halfLength < beginningOfRow) {
          ref.position.x = endOfRow + halfLength;
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

      // Where the train starts entering the map
      const spawnX =
        movement > 0 ? beginningOfRow - halfLength : endOfRow + halfLength;

      // First initialization
      if (!rowData.started) {
        ref.position.x = spawnX;
        rowData.started = true;
        return;
      }

      // Wait three seconds after leaving the map
      if (rowData.waitingToRespawn) {
        rowData.respawnTimer -= delta;

        if (rowData.respawnTimer <= 0) {
          ref.position.x = spawnX;
          rowData.waitingToRespawn = false;
        }

        return;
      }

      // Move the train
      const nextX = ref.position.x + movement * rowData.speed * delta;

      // Check whether the ENTIRE train has left the map
      const hasClearedMap =
        movement > 0
          ? nextX - halfLength > endOfRow
          : nextX + halfLength < beginningOfRow;

      ref.position.x = nextX;

      if (hasClearedMap) {
        rowData.waitingToRespawn = true;
        rowData.respawnTimer = 3;
      }

      return;
    }

    // Existing car and truck animation
    if (rowData.type !== "car" && rowData.type !== "truck") return;

    rowData.vehicles.forEach(({ ref }) => {
      if (!ref) throw Error("Vehicle reference is missing");

      const movement = rowData.direction ? 1 : -1;
      const nextX = ref.position.x + movement * rowData.speed * delta;

      if (movement > 0 && nextX > endOfRow) {
        ref.position.x = beginningOfRow;
      } else if (movement < 0 && nextX < beginningOfRow) {
        ref.position.x = endOfRow;
      } else {
        ref.position.x = nextX;
      }
    });
  });
}
