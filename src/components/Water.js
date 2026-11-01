import * as THREE from "three";
import { tilesPerRow, tileSize } from "../constants.js";

export function Water(rowIndex) {
  const water = new THREE.Group();
  water.position.y = rowIndex * tileSize;

  const foundation = new THREE.BoxGeometry(tilesPerRow * tileSize, tileSize, 3);

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
