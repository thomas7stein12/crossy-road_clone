import * as THREE from "three";
import { minTileIndex, maxTileIndex, tilesPerRow } from "../constants.js";

export function generateRows(amount) {
  const rows = [];
  for (let i = 0; i < amount; i++) {
    const rowData = generateRow();
    rows.push(rowData);
  }
  return rows;
}

function generateRow() {
  const type = randomElement(["car", "truck", "forest", "water", "train"]);

  if (type === "car") return generateCarLaneMetadata();
  if (type === "truck") return generateTruckLaneMetadata();
  if (type === "water") return generateWaterMetadata();
  if (type === "train") return generateTrainMetadata();

  return generateForestMetadata();
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateForestMetadata() {
  const occupiedTiles = new Set();
  const trees = Array.from({ length: 4 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);

    const height = randomElement([20, 45, 60]);

    return { tileIndex, height };
  });

  return { type: "forest", trees };
}

function generateCarLaneMetadata() {
  const direction = randomElement([true, false]);
  const speed = randomElement([225, 245, 275, 285, 305, 335]);

  const occupiedTiles = new Set();

  const vehicles = Array.from({ length: 4 }, () => {
    let initialTileIndex;
    do {
      initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);

    const color = randomElement([
      0xcc0202, 0xcc5602, 0xccc502, 0x9ad102, 0x2fd102, 0x02d1af, 0x02a4d1,
      0x1702d1, 0x5102d1, 0xd102c7,
    ]);

    return { initialTileIndex, color };
  });

  return { type: "car", direction, speed, vehicles };
}

function generateTruckLaneMetadata() {
  const direction = randomElement([true, false]);
  const speed = randomElement([75, 95, 115, 135, 155]);

  const occupiedTiles = new Set();

  const vehicles = Array.from({ length: 3 }, () => {
    let initialTileIndex;
    do {
      initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 2);
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);
    occupiedTiles.add(initialTileIndex + 2);

    const color = randomElement([0x6e0107, 0x01106e, 0x036e01, 0x6e4401]);

    return { initialTileIndex, color };
  });

  return { type: "truck", direction, speed, vehicles };
}

function generateWaterMetadata() {
  const direction = randomElement([true, false]);
  const speed = randomElement([18, 24, 30, 36]);

  const logCount = randomElement([3, 4]);

  const spacing = (tilesPerRow + 2) / logCount;

  const logs = Array.from({ length: logCount }, (_, index) => {
    const lengthInTiles = randomElement([3, 3, 4]);

    const initialTileIndex =
      minTileIndex - 1 + spacing * index + (Math.random() - 0.5) * 0.5;

    return {
      initialTileIndex,
      lengthInTiles,
    };
  });

  const padCount = randomElement([2, 3]);
  const occupiedTiles = new Set();

  while (occupiedTiles.size < padCount) {
    occupiedTiles.add(THREE.MathUtils.randInt(minTileIndex, maxTileIndex));
  }

  const lilyPads = [...occupiedTiles].map((tileIndex) => ({
    tileIndex,
    radius: 14,
  }));

  return {
    type: "water",
    direction,
    speed,
    logs,
    lilyPads,
  };
}

function generateTrainMetadata() {
  const color = randomElement([
    0x187f85, // Teal
    0x2869a8, // Ocean blue
    0x6256a8, // Indigo
    0x89518d, // Purple
    0xa64f76, // Rose
    0xb85e42, // Rust
    0xa47a32, // Golden brown
    0x56834a, // Forest green
  ]);

  const direction = randomElement([true, false]);

  // Trains are between 3 and 6 truck lengths
  const lengthInTruckLengths = THREE.MathUtils.randInt(3, 6);
  const length = lengthInTruckLengths * 100;

  // Much faster than cars and trucks
  const speed = randomElement([700, 800, 900, 1000]);

  return {
    type: "train",
    direction,
    speed,
    length,
    color,

    // Train movement state
    started: false,
    waitingToRespawn: false,
    respawnTimer: 0,
  };
}
