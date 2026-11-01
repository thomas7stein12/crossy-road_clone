import * as THREE from "three";
import { generateRows } from "../utilities/generateRows.js";
import { Grass } from "./Grass.js";
import { Tree } from "./Tree.js";
import { Car } from "./Car.js";
import { Truck } from "./Truck.js";
import { Road } from "./Road.js";
import { Water } from "./Water.js";
import { Log } from "./Log.js";
import { LilyPad } from "./LilyPad.js";
import { Train } from "./Train.js";
import { TrainTrack } from "./TrainTrack.js";
import { MapBoundary } from "./MapBoundary.js";

export const metadata = [];
export const map = new THREE.Group();

let firstMetadataRow = 1;
export let lastGeneratedRow = 0;

const startingRows = [];

export function getRowData(rowIndex) {
  return metadata[rowIndex - firstMetadataRow];
}

function addRowObject(rowData, object, disposeMaterials = true) {
  map.add(object);

  rowData.mapObjects.push({
    object,
    disposeMaterials,
  });
}

function disposeMapObject({ object, disposeMaterials }) {
  map.remove(object);

  object.traverse((child) => {
    if (!child.isMesh) return;

    child.geometry.dispose();

    if (!disposeMaterials) return;

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];

    materials.forEach((material) => material.dispose());
  });
}

export function initializeMap() {
  // Clean up the previous map when starting a new game
  metadata.forEach((rowData) => rowData.mapObjects?.forEach(disposeMapObject));

  startingRows.forEach(({ objects }) => objects.forEach(disposeMapObject));

  metadata.length = 0;
  startingRows.length = 0;

  firstMetadataRow = 1;
  lastGeneratedRow = 0;

  map.clear();

  // Create the starting grass rows
  for (let rowIndex = 0; rowIndex > -20; rowIndex--) {
    const grass = Grass(rowIndex);
    const boundary = MapBoundary(rowIndex, "grass");

    map.add(grass, boundary);

    startingRows.push({
      rowIndex,
      objects: [
        { object: grass, disposeMaterials: true },
        { object: boundary, disposeMaterials: false },
      ],
    });
  }

  addRows();
}

export function addRows() {
  const newMetadata = generateRows(20);

  newMetadata.forEach((rowData, index) => {
    const rowIndex = lastGeneratedRow + index + 1;

    rowData.mapObjects = [];

    if (rowData.type === "forest") {
      const row = Grass(rowIndex);

      rowData.trees.forEach(({ tileIndex, height }) => {
        const three = Tree(tileIndex, height);
        row.add(three);
      });
      addRowObject(rowData, row);
    }

    if (rowData.type === "car") {
      const row = Road(rowIndex);

      rowData.vehicles.forEach((vehicle) => {
        const car = Car(
          vehicle.initialTileIndex,
          rowData.direction,
          vehicle.color,
        );
        vehicle.ref = car;
        row.add(car);
      });
      addRowObject(rowData, row);
    }

    if (rowData.type === "truck") {
      const row = Road(rowIndex);

      rowData.vehicles.forEach((vehicle) => {
        const truck = Truck(
          vehicle.initialTileIndex,
          rowData.direction,
          vehicle.color,
        );
        vehicle.ref = truck;
        row.add(truck);
      });
      addRowObject(rowData, row);
    }

    if (rowData.type === "water") {
      const row = Water(rowIndex);

      rowData.logs.forEach((logData) => {
        const log = Log(logData.initialTileIndex, logData.lengthInTiles);

        logData.ref = log;
        row.add(log);
      });

      rowData.lilyPads.forEach((padData) => {
        const lilyPad = LilyPad(padData.tileIndex);
        row.add(lilyPad);
      });

      addRowObject(rowData, row);
    }

    if (rowData.type === "train") {
      const row = TrainTrack(rowIndex);

      const train = Train(rowData.length, rowData.direction, rowData.color);

      rowData.ref = train;

      row.add(train);
      addRowObject(rowData, row);
    }

    // Add the appropriate decorative boundary to every row
    const boundaryType =
      rowData.type === "forest"
        ? "grass"
        : rowData.type === "car" || rowData.type === "truck"
          ? "road"
          : rowData.type;

    addRowObject(rowData, MapBoundary(rowIndex, boundaryType), false);
  });

  metadata.push(...newMetadata);
  lastGeneratedRow += newMetadata.length;
}

export function pruneRows(oldestAllowedRow) {
  // Remove the original starting grass rows
  while (startingRows.length && startingRows[0].rowIndex < oldestAllowedRow) {
    const oldRow = startingRows.shift();

    oldRow.objects.forEach(disposeMapObject);
  }

  // Calculate how many generated rows are too far behind
  const removeCount = Math.min(
    metadata.length,
    Math.max(0, oldestAllowedRow - firstMetadataRow),
  );

  if (removeCount === 0) return;

  // Remove old row metadata and their Three.js objects
  const removedRows = metadata.splice(0, removeCount);

  removedRows.forEach((rowData) => {
    rowData.mapObjects.forEach(disposeMapObject);
  });

  firstMetadataRow += removeCount;
}
