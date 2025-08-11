import { AddCircleCommand, Circle } from "./shapes/circle.js";
import { CommandManager } from "./shapes/command-manager.js";
import { AddRectangleCommand, Rectangle } from "./shapes/rectangle.js";
import { Store } from "./store.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const store = new Store();
const manager = new CommandManager();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  store.shapes.forEach((shape) => shape.draw(ctx));
}

let startX, startY;

const computeCanvasPosition = () => {
  const canvasComputedStyle = canvas.getBoundingClientRect();
  const { x, y } = canvasComputedStyle;
  store.setCanvasCoordinates({ x, y });
};

window.addEventListener("load", computeCanvasPosition);

canvas.addEventListener("mousedown", (event) => {
  store.setIsDrawing(true);
  if (store.getControls().isMousePositionForStartingCoordinates) {
    startX = event.clientX - store.getCanvasCoordinates().x;
    startY = event.clientY - store.getCanvasCoordinates().y;
    store.setIsMousePositionForStartingCoordinates(false);
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (!store.getControls().isDrawing) return;
  // const width = event.clientX - store.getCanvasCoordinates().x - startX;
  // const height = event.clientY - store.getCanvasCoordinates().y - startY;
  // manager.executeCommand(
  //   new AddRectangleCommand(store, new Rectangle(startX, startY, width, height))
  // );
  const radius = Math.abs(
    event.clientX - store.getCanvasCoordinates().x - startX
  );
  manager.executeCommand(
    new AddCircleCommand(store, new Circle(startX, startY, radius))
  );
  draw();
});
canvas.addEventListener("mouseup", () => {
  store.setIsMousePositionForStartingCoordinates(true);

  store.setIsDrawing(false);
});

document.getElementById("btn-undo").addEventListener("click", () => {
  manager.undo();
  draw();
});
