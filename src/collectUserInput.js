import { queueMove } from "./components/Player.js";
import { clearQueuedMoves } from "./animatePlayer.js";

document
  .getElementById("forward")
  ?.addEventListener("click", () => queueMove("forward"));

document
  .getElementById("backward")
  ?.addEventListener("click", () => queueMove("backward"));

document
  .getElementById("left")
  ?.addEventListener("click", () => queueMove("left"));

document
  .getElementById("right")
  ?.addEventListener("click", () => queueMove("right"));

const repeatingKeys = new Set();

window.addEventListener("keydown", (event) => {
  const directions = {
    ArrowUp: "forward",
    ArrowDown: "backward",
    ArrowLeft: "left",
    ArrowRight: "right",
  };

  const direction = directions[event.key];

  if (!direction) return;

  event.preventDefault();

  // Detect when the browser starts repeating a held key
  if (event.repeat) {
    repeatingKeys.add(event.code);
  }

  queueMove(direction);
});

window.addEventListener("keyup", (event) => {
  // Only clear the queue if the key was actually held down
  if (repeatingKeys.delete(event.code) && repeatingKeys.size === 0) {
    clearQueuedMoves();
  }
});
