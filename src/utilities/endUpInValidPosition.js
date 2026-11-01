import { calculateFinalPosition } from "./calculateFinalPosition.js";
import { minTileIndex, maxTileIndex } from "../constants.js";
import { getRowData } from "../components/Map";

export function endsUpInValidPosition(
  currentPosition,
  moves,
  oldestAllowedRow = -Infinity,
) {
  const finalPosition = calculateFinalPosition(currentPosition, moves);

  if (
    finalPosition.rowIndex < oldestAllowedRow ||
    finalPosition.rowIndex === -1 ||
    finalPosition.tileIndex === minTileIndex - 1 ||
    finalPosition.tileIndex === maxTileIndex + 1
  ) {
    return false;
  }

  const finalRow = getRowData(finalPosition.rowIndex - 1);
  if (
    finalRow &&
    finalRow.type === "forest" &&
    finalRow.trees.some((tree) => tree.tileIndex === finalPosition.tileIndex)
  ) {
    return false;
  }

  return true;
}
