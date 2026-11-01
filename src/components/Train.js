import * as THREE from "three";
import { Wheel } from "./Wheel.js";

export function Train(length, direction) {
  const train = new THREE.Group();

  // Face the locomotive in the direction of travel
  if (!direction) train.rotation.z = Math.PI;

  const segmentCount = Math.round(length / 100);
  const segmentLength = length / segmentCount;

  // Materials
  const chassisMaterial = new THREE.MeshLambertMaterial({
    color: 0x292c32,
    flatShading: true,
  });

  const locomotiveMaterial = new THREE.MeshLambertMaterial({
    color: 0x982525,
    flatShading: true,
  });

  const carriageMaterial = new THREE.MeshLambertMaterial({
    color: 0x315d78,
    flatShading: true,
  });

  const roofMaterial = new THREE.MeshLambertMaterial({
    color: 0x9ca5aa,
    flatShading: true,
  });

  for (let i = 0; i < segmentCount; i++) {
    // The locomotive is at the front (+X)
    const segmentX = length / 2 - segmentLength / 2 - i * segmentLength;

    const isLocomotive = i === 0;

    // Chassis
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(segmentLength - 8, 34, 10),
      chassisMaterial,
    );

    chassis.position.set(segmentX, 0, 13);
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    train.add(chassis);

    // Wheels for this train section
    for (const xOffset of [-segmentLength * 0.28, segmentLength * 0.28]) {
      for (const y of [-12, 12]) {
        const wheel = Wheel(segmentX + xOffset);
        wheel.position.y = y;
        train.add(wheel);
      }
    }

    if (isLocomotive) {
      // Main locomotive body
      const engineBody = new THREE.Mesh(
        new THREE.BoxGeometry(segmentLength - 10, 38, 22),
        locomotiveMaterial,
      );

      engineBody.position.set(segmentX, 0, 29);
      engineBody.castShadow = true;
      engineBody.receiveShadow = true;
      train.add(engineBody);

      // Boiler
      const boiler = new THREE.Mesh(
        new THREE.CylinderGeometry(13, 13, segmentLength * 0.58, 8),
        locomotiveMaterial,
      );

      boiler.rotation.z = Math.PI / 2;
      boiler.position.set(segmentX + 8, 0, 35);
      boiler.castShadow = true;
      train.add(boiler);

      // Driver cabin
      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(34, 34, 28),
        roofMaterial,
      );

      cabin.position.set(segmentX - 20, 0, 39);
      cabin.castShadow = true;
      cabin.receiveShadow = true;
      train.add(cabin);

      // Chimney
      const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(12, 12, 18),
        chassisMaterial,
      );

      chimney.position.set(segmentX + 30, 0, 52);
      chimney.castShadow = true;
      train.add(chimney);
    } else {
      // Carriage body
      const carriage = new THREE.Mesh(
        new THREE.BoxGeometry(segmentLength - 10, 35, 26),
        carriageMaterial,
      );

      carriage.position.set(segmentX, 0, 29);
      carriage.castShadow = true;
      carriage.receiveShadow = true;
      train.add(carriage);

      // Carriage roof
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(segmentLength - 20, 30, 5),
        roofMaterial,
      );

      roof.position.set(segmentX, 0, 44.5);
      roof.castShadow = true;
      train.add(roof);
    }
  }

  return train;
}
