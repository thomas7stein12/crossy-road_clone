import * as THREE from "three";
import { endsUpInValidPosition } from "../utilities/endUpInValidPosition.js";
import { addRows, lastGeneratedRow, pruneRows } from "./Map.js";
export const player = Player();

const MAX_BACKTRACK_ROWS = 10;

let highestRowReached = 0;
let gameStarted = false;

export function setGameStarted(value) {
  gameStarted = value;
}

export function isGameStarted() {
  return gameStarted;
}

function Player() {
  const player = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 20),
    new THREE.MeshLambertMaterial({
      color: "white",
      flatShading: true,
    }),
  );
  body.castShadow = true;
  body.receiveShadow = true;
  body.position.z = 13;
  player.add(body);

  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 2),
    new THREE.MeshLambertMaterial({
      color: 0xf0619a,
      flatShading: true,
    }),
  );
  cap.position.z = 24;
  cap.castShadow = true;
  cap.receiveShadow = true;
  player.add(cap);

  const playerContainer = new THREE.Group();
  playerContainer.add(player);

  return playerContainer;
}

export const position = {
  currentRow: 0,
  currentTile: 0,
};

export const movesQueue = [];

export function initializePlayer() {
  player.position.x = 0;
  player.position.y = 0;
  player.children[0].position.z = 0;
  player.children[0].visible = true;

  position.currentRow = 0;
  position.currentTile = 0;

  movesQueue.length = 0;
  highestRowReached = 0;
  gameStarted = false;
}

export function queueMove(direction) {
  // Don't allow movement after the player dies
  // Don't allow movement before the game starts or after death
  const resultDOM = document.getElementById("result-container");

  if (!gameStarted || resultDOM?.style.visibility === "visible") return;
  
  const isValidMove = endsUpInValidPosition(
    {
      rowIndex: position.currentRow,
      tileIndex: position.currentTile,
    },
    [...movesQueue, direction],
    highestRowReached - MAX_BACKTRACK_ROWS,
  );

  if (!isValidMove) return;

  movesQueue.push(direction);
}

export function stepCompleted() {
  const direction = movesQueue.shift();

  if (direction === "forward") position.currentRow += 1;
  if (direction === "backward") position.currentRow -= 1;
  if (direction === "left") position.currentTile -= 1;
  if (direction === "right") position.currentTile += 1;

  // Keep track of the furthest row reached
  if (position.currentRow > highestRowReached) {
    highestRowReached = position.currentRow;
  }

  // Generate more rows as the player approaches the end
  if (position.currentRow > lastGeneratedRow - MAX_BACKTRACK_ROWS) {
    addRows();
  }

  // Remove rows that are too far behind
  pruneRows(highestRowReached - MAX_BACKTRACK_ROWS);
  const scoreDOM = document.getElementById("score");
  if (scoreDOM) scoreDOM.innerText = position.currentRow.toString();
}
