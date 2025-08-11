import { AddShapeCommand } from "./commands/add-shape.js";
import { CommandManager } from "./commands/command-manager.js";
import { store } from "./store.js";
import { CIRCLE, drawingTools, LINE, RECTANGLE } from "./constants.js";
import {
  computeStartingCoordinates,
  drawCircle,
  drawLine,
  drawRectangle,
} from "./shapes/draw.js";

const canvas = document.getElementById("canvas");
const manager = new CommandManager();
const ctx = canvas.getContext("2d");
ctx.lineWidth = 2;
let shapeBeingDrawn = null;

const clearCanvasAndRedrawAllShapes = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  store.shapes.forEach((shape) => shape.draw(ctx));
};

const computeCanvasPosition = () => {
  const canvasComputedStyle = canvas.getBoundingClientRect();
  const { x, y } = canvasComputedStyle;
  store.setCanvasCoordinates({ x, y });
};

const beginDrawing = (event) => {
  store.setIsDrawing(true);
  if (store.getControls().isMousePositionForStartingCoordinates) {
    computeStartingCoordinates(event);
    store.setIsMousePositionForStartingCoordinates(false);
  }
};

const drawing = (event) => {
  if (!store.getControls().isDrawing) return;

  switch (store.shapeSelectedToDraw) {
    case RECTANGLE:
      shapeBeingDrawn = drawRectangle(event);
      break;
    case CIRCLE:
      shapeBeingDrawn = drawCircle(event);
      break;

    case LINE:
      shapeBeingDrawn = drawLine(event);
      break;
    default:
      console.log("Unknown shape");
  }

  console.log(shapeBeingDrawn);
  clearCanvasAndRedrawAllShapes();
  if (shapeBeingDrawn) shapeBeingDrawn.draw(ctx);
};

const endDrawing = () => {
  store.setIsMousePositionForStartingCoordinates(true);
  store.setIsDrawing(false);
  manager.executeCommand(new AddShapeCommand(store, shapeBeingDrawn));
};

const undo = () => {
  manager.undo();
  clearCanvasAndRedrawAllShapes();
};

const redo = () => {
  manager.redo();
  clearCanvasAndRedrawAllShapes();
};

// Event listeners
window.addEventListener("load", computeCanvasPosition);
canvas.addEventListener("mousedown", beginDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", endDrawing);
drawingTools.forEach((tool) => {
  document
    .getElementById(tool.id)
    .addEventListener("click", () => store.setShapeSelectedToDraw(tool.shape));
});
document.getElementById("btn-undo").addEventListener("click", undo);
document.getElementById("btn-redo").addEventListener("click", redo);
