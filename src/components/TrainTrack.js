import * as THREE from "three";
import { visualRowWidth, tileSize } from "../constants.js";

export function TrainTrack(rowIndex) {
  const track = new THREE.Group();
  track.position.y = rowIndex * tileSize;

  const width = visualRowWidth;

  // Gravel foundation
  const foundation = new THREE.Mesh(
    new THREE.BoxGeometry(width, tileSize, 3),
    new THREE.MeshLambertMaterial({
      color: 0x66615e,
      flatShading: true,
    }),
  );

  foundation.position.z = 1.5;
  foundation.receiveShadow = true;
  track.add(foundation);

  // Wooden railway sleepers
  const sleeperMaterial = new THREE.MeshLambertMaterial({
    color: 0x503725,
    flatShading: true,
  });

  const sleeperSpacing = 30;
  const sleeperCount = Math.ceil(width / sleeperSpacing);

  for (let i = 0; i < sleeperCount; i++) {
    const sleeper = new THREE.Mesh(
      new THREE.BoxGeometry(12, 38, 3),
      sleeperMaterial,
    );

    sleeper.position.set(-width / 2 + i * sleeperSpacing, 0, 3);

    sleeper.castShadow = true;
    sleeper.receiveShadow = true;

    track.add(sleeper);
  }

  // Two metal rails
  const railMaterial = new THREE.MeshLambertMaterial({
    color: 0x777b80,
    flatShading: true,
  });

  for (const y of [-12, 12]) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(width + 10, 5, 4),
      railMaterial,
    );

    rail.position.set(0, y, 5);
    rail.castShadow = true;
    rail.receiveShadow = true;

    track.add(rail);
  }

  return track;
}
