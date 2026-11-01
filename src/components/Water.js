import * as THREE from "three";
import { visualRowWidth, tileSize } from "../constants.js";

export function Water(rowIndex) {
  const water = new THREE.Group();
  water.position.y = rowIndex * tileSize;

  const foundation = new THREE.BoxGeometry(visualRowWidth, tileSize, 3);

  const material = new THREE.MeshLambertMaterial({
    color: 0x287f9f,
    flatShading: true,
  });

  const surface = new THREE.Mesh(foundation, material);
  surface.position.z = 1.5;
  surface.receiveShadow = true;

  water.add(surface);

  return water;
}
