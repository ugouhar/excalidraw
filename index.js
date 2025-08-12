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
import { insideCircle, insideRectangle } from "./utils/utils.js";

const canvas = document.getElementById("canvas");
const manager = new CommandManager();
const ctx = canvas.getContext("2d");
ctx.lineWidth = store.getBrushSize();
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
  if (store.getControls().isMovingShape) return;
  store.setIsDrawing(true);
  if (store.getControls().isMousePositionForStartingCoordinates) {
    computeStartingCoordinates(event);
    store.setIsMousePositionForStartingCoordinates(false);
  }
};

const drawing = (event) => {
  if (store.getControls().isMovingShape) return;
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

  clearCanvasAndRedrawAllShapes();
  if (shapeBeingDrawn) shapeBeingDrawn.draw(ctx);
};

const endDrawing = () => {
  if (store.getControls().isMovingShape) return;
  store.setIsMousePositionForStartingCoordinates(true);
  store.setIsDrawing(false);
  if (shapeBeingDrawn)
    manager.executeCommand(new AddShapeCommand(store, shapeBeingDrawn));
  console.log(store.shapes);
};

const undo = () => {
  manager.undo();
  clearCanvasAndRedrawAllShapes();
};

const redo = () => {
  manager.redo();
  clearCanvasAndRedrawAllShapes();
};

const movingShape = () => {};

const handleCanvasClicked = (event) => {
  const allShapes = store.shapes;
  const x = event.clientX - store.getCanvasCoordinates().x;
  const y = event.clientY - store.getCanvasCoordinates().y;
  console.log(x, y);
  for (let i = allShapes.length - 1; i >= 0; i--) {
    const shapeType = allShapes[i].constructor.name;
    switch (shapeType) {
      case "Rectangle":
        if (insideRectangle(allShapes[i], x, y)) {
          console.log("inside rectangle");
        }
        break;
      case "Circle":
        if (insideCircle(allShapes[i], x, y)) {
          console.log("inside circle");
        }
        break;
      default:
        console.log("Unknown shape in list");
    }
  }
};

// Event listeners
window.addEventListener("load", computeCanvasPosition);
canvas.addEventListener("click", handleCanvasClicked);
canvas.addEventListener("mousedown", beginDrawing);
canvas.addEventListener("mousemove", (event) => {
  if (store.getControls().isMovingShape) movingShape();
  else if (store.getControls().isDrawing) drawing(event);
});
canvas.addEventListener("mouseup", endDrawing);
document.getElementById("btn-select").addEventListener("click", () => {
  store.setIsMovingShape(true);
  store.setIsDrawing(false);
  canvas.classList.remove("canvas-drawing");
});
drawingTools.forEach((tool) => {
  document.getElementById(tool.id).addEventListener("click", () => {
    store.setShapeSelectedToDraw(tool.shape);
    store.setIsMovingShape(false);
    canvas.classList.add("canvas-drawing");
  });
});
document.getElementById("btn-undo").addEventListener("click", undo);
document.getElementById("btn-redo").addEventListener("click", redo);
