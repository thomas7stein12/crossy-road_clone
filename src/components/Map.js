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

export const metadata = [];

export const map = new THREE.Group();

export function initializeMap() {
  metadata.length = 0;
  map.remove(...map.children);

  for (let rowIndex = 0; rowIndex > -5; rowIndex--) {
    const grass = Grass(rowIndex);
    map.add(grass);
  }
  addRows();
}

export function addRows() {
  const newMetadata = generateRows(20);

  const startIndex = metadata.length;
  metadata.push(...newMetadata);

  newMetadata.forEach((rowData, index) => {
    const rowIndex = startIndex + index + 1;

    if (rowData.type === "forest") {
      const row = Grass(rowIndex);

      rowData.trees.forEach(({ tileIndex, height }) => {
        const three = Tree(tileIndex, height);
        row.add(three);
      });
      map.add(row);
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
      map.add(row);
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
      map.add(row);
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

      map.add(row);
    }

    if (rowData.type === "train") {
      const row = TrainTrack(rowIndex);

      const train = Train(rowData.length, rowData.direction, rowData.color);

      rowData.ref = train;

      row.add(train);
      map.add(row);
    }
  });
}
