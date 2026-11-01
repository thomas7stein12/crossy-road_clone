import * as THREE from "three";
import { Wheel } from "./Wheel.js";

export function Train(length, direction, color) {
  const train = new THREE.Group();

  // Face the locomotive in the direction of travel
  if (!direction) train.rotation.z = Math.PI;

  const segmentCount = Math.round(length / 100);
  const segmentLength = length / segmentCount;

  // Main train color and alternating darker color
  const mainColor = new THREE.Color(color);
  const alternateColor = mainColor.clone().multiplyScalar(0.72);

  // Materials
  const chassisMaterial = new THREE.MeshLambertMaterial({
    color: 0x292c32,
    flatShading: true,
  });

  const mainMaterial = new THREE.MeshLambertMaterial({
    color: mainColor,
    flatShading: true,
  });

  const alternateMaterial = new THREE.MeshLambertMaterial({
    color: alternateColor,
    flatShading: true,
  });

  // One continuous lower chassis
  const chassis = new THREE.Mesh(
    new THREE.BoxGeometry(length - 8, 34, 9),
    chassisMaterial,
  );

  chassis.position.z = 13;
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  train.add(chassis);

  // Individual train carriages
  for (let i = 0; i < segmentCount; i++) {
    const segmentX = length / 2 - segmentLength / 2 - i * segmentLength;

    // Alternate colors between carriages
    const material = i % 2 === 0 ? mainMaterial : alternateMaterial;

    const carriage = new THREE.Mesh(
      new THREE.BoxGeometry(segmentLength - 6, 34, 27),
      material,
    );

    carriage.position.set(segmentX, 0, 29.5);
    carriage.castShadow = true;
    carriage.receiveShadow = true;
    train.add(carriage);

    // Raised driver's cab on the front carriage
    if (i === 0) {
      const cab = new THREE.Mesh(
        new THREE.BoxGeometry(38, 34, 13),
        alternateMaterial,
      );

      cab.position.set(segmentX + 17, 0, 49.5);
      cab.castShadow = true;
      cab.receiveShadow = true;
      train.add(cab);
    }

    // Reusable wheels underneath each carriage
    for (const xOffset of [-segmentLength * 0.28, segmentLength * 0.28]) {
      const wheel = Wheel(segmentX + xOffset);
      train.add(wheel);
    }
  }

  return train;
}
