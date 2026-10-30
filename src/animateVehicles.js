import * as THREE from "three";
import { metadata as rows } from "./components/Map.js";
import { minTileIndex, maxTileIndex, tileSize } from "./constants.js";

const clock = new THREE.Clock();


export function animateVehicles() {
  const delta = clock.getDelta();

  rows.forEach((rowData) => {
    if (rowData.type !== "car" && rowData.type !== "truck") return;

    const beginningOfRow = (minTileIndex - 2) * tileSize;
    const endOfRow = (maxTileIndex + 2) * tileSize;

    rowData.vehicles.forEach(({ ref }) => {
      if (!ref) throw Error("Vehicle reference is missing");

      // Direction determines whether the vehicle moves left or right.
      const movement = rowData.direction ? 1 : -1;
      const nextX = ref.position.x + movement * rowData.speed * delta;

      // Wrap around when the vehicle passes the edge of the road.
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
