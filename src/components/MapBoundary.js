import * as THREE from "three";
import { tilesPerRow, tileSize } from "../constants.js";

const halfWidth = (tilesPerRow * tileSize) / 2;

// Grass stones
// Wooden fence materials
const fenceMaterial = new THREE.MeshLambertMaterial({
  color: 0x79502f,
  flatShading: true,
});

const fencePostMaterial = new THREE.MeshLambertMaterial({
  color: 0x50321f,
  flatShading: true,
});

// Road markings
const roadMaterial = new THREE.MeshBasicMaterial({
  color: 0xe5dfbd,
});

// Water buoys
const buoyMaterial = new THREE.MeshLambertMaterial({
  color: 0xeff2400,
  flatShading: true,
});

const buoyCapMaterial = new THREE.MeshLambertMaterial({
  color: 0xf3e7c5,
  flatShading: true,
});

// Railway warning markings
const warningMaterial = new THREE.MeshLambertMaterial({
  color: 0xe5b52f,
  flatShading: true,
});

const darkWarningMaterial = new THREE.MeshLambertMaterial({
  color: 0x292c32,
  flatShading: true,
});

export function MapBoundary(rowIndex, type) {
  const boundary = new THREE.Group();

  boundary.position.y = rowIndex * tileSize;

  // Create both sides of the playable map
  for (const side of [-1, 1]) {
    const x = side;

    if (type === "grass") {
      createGrassBoundary(boundary, x);
    }

    if (type === "road") {
      createRoadBoundary(boundary, x);
    }

    if (type === "water") {
      createWaterBoundary(boundary, x);
    }

    if (type === "train") {
      createTrainBoundary(boundary, x);
    }
  }

  return boundary;
}

function createGrassBoundary(group, side) {
  const x = side * (halfWidth + 6);

  // Two horizontal wooden rails
  for (const z of [8, 16]) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(4, tileSize + 2, 4),
      fenceMaterial,
    );

    rail.position.set(x, 0, z);
    rail.castShadow = true;
    rail.receiveShadow = true;

    group.add(rail);
  }

  // Vertical fence post
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(7, 7, 24),
    fencePostMaterial,
  );

  post.position.set(x, 0, 12);
  post.castShadow = true;
  post.receiveShadow = true;

  group.add(post);
}

function createRoadBoundary(group, side) {
  const marking = new THREE.Mesh(
    new THREE.BoxGeometry(3, tileSize, 0.3),
    roadMaterial,
  );

  marking.position.set(side * (halfWidth - 3), 0, 0.3);

  group.add(marking);
}

function createWaterBoundary(group, side) {
  const buoy = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 5, 10, 6),
    buoyMaterial,
  );

  body.rotation.x = Math.PI / 2;
  body.position.z = 6;
  buoy.add(body);

  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 2, 6),
    buoyCapMaterial,
  );

  cap.rotation.x = Math.PI / 2;
  cap.position.z = 12;
  buoy.add(cap);

  buoy.position.set(side * (halfWidth + 9), 0, 0);

  group.add(buoy);
}

function createTrainBoundary(group, side) {
  const x = side * (halfWidth - 6);

  // Yellow warning strip
  const background = new THREE.Mesh(
    new THREE.BoxGeometry(12, tileSize, 1),
    warningMaterial,
  );

  background.position.set(x, 0, 3.5);
  group.add(background);

  // Dark diagonal hazard stripes
  for (let i = 0; i < 3; i++) {
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(4, 12, 1.5),
      darkWarningMaterial,
    );

    stripe.position.set(x, (i - 1) * 13, 4.5);

    stripe.rotation.z = Math.PI / 4;

    group.add(stripe);
  }
}
