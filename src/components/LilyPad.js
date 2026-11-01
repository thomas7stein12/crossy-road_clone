import * as THREE from "three";
import { tileSize } from "../constants.js";

export function LilyPad(tileIndex) {
  const lilyPad = new THREE.Group();

  lilyPad.position.x = tileIndex * tileSize;

  const leaf = new THREE.Mesh(
    new THREE.CylinderGeometry(14, 14, 3, 8),
    new THREE.MeshLambertMaterial({
      color: 0x39852d,
      flatShading: true,
    }),
  );

  leaf.rotation.x = Math.PI / 2;
  leaf.position.z = 2.5;
  leaf.castShadow = true;
  lilyPad.add(leaf);

  const center = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 6, 1.5, 6),
    new THREE.MeshLambertMaterial({
      color: 0x76a83b,
      flatShading: true,
    }),
  );

  center.rotation.x = Math.PI / 2;
  center.position.z = 4.5;
  lilyPad.add(center);

  return lilyPad;
}
