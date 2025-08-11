import { AddShapeCommand } from "./commands/add-shape.js";
import { Circle } from "./shapes/circle.js";
import { CommandManager } from "./commands/command-manager.js";
import { Rectangle } from "./shapes/rectangle.js";
import { Store } from "./store.js";
import { CIRCLE, RECTANGLE } from "./constants.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.lineWidth = "2";
const store = new Store();
const manager = new CommandManager();
let startX, startY;
let shapeBeingDrawn = null;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  store.shapes.forEach((shape) => shape.draw(ctx));
}

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

  switch (store.shapeSelectedToDraw) {
    case RECTANGLE: {
      const width = event.clientX - store.getCanvasCoordinates().x - startX;
      const height = event.clientY - store.getCanvasCoordinates().y - startY;
      shapeBeingDrawn = new Rectangle(startX, startY, width, height);
      break;
    }
    case CIRCLE: {
      const radius = Math.abs(
        event.clientX - store.getCanvasCoordinates().x - startX
      );
      shapeBeingDrawn = new Circle(startX, startY, radius);
      break;
    }
    default:
      console.log("Unknown shape");
  }
  draw();
  shapeBeingDrawn.draw(ctx);
});

canvas.addEventListener("mouseup", () => {
  store.setIsMousePositionForStartingCoordinates(true);
  store.setIsDrawing(false);
  manager.executeCommand(new AddShapeCommand(store, shapeBeingDrawn));
});

document
  .getElementById("btn-rectangle")
  .addEventListener("click", () => store.setShapeSelectedToDraw(RECTANGLE));
document
  .getElementById("btn-circle")
  .addEventListener("click", () => store.setShapeSelectedToDraw(CIRCLE));

document.getElementById("btn-undo").addEventListener("click", () => {
  manager.undo();
  draw();
});
