import * as THREE from "three";
import { tileSize } from "../constants.js";

export function Log(initialTileIndex, lengthInTiles) {
  const log = new THREE.Group();

  log.position.x = initialTileIndex * tileSize;

  const length = lengthInTiles * tileSize;

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(length, tileSize * 0.62, 8),
    new THREE.MeshLambertMaterial({
      color: 0x79502b,
      flatShading: true,
    }),
  );

  body.position.z = 4;
  body.castShadow = true;
  body.receiveShadow = true;
  log.add(body);

  // Add some darker bark details
  const barkMaterial = new THREE.MeshLambertMaterial({
    color: 0x50321f,
    flatShading: true,
  });

  for (let i = 0; i < 3; i++) {
    const bark = new THREE.Mesh(
      new THREE.BoxGeometry(4, tileSize * 0.64, 8.5),
      barkMaterial,
    );

    bark.position.set((i - 1) * (length / 4), 0, 4);

    log.add(bark);
  }

  return log;
}
