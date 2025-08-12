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
import { MoveShapeCommand } from "./commands/move-shape.js";

const canvas = document.getElementById("canvas");
const manager = new CommandManager();
const ctx = canvas.getContext("2d");
ctx.lineWidth = store.getBrushSize();
let shapeBeingDrawn = null;
let shapeBeingMoved = null;

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

  clearCanvasAndRedrawAllShapes();
  if (shapeBeingDrawn) shapeBeingDrawn.draw(ctx);
};

const endDrawing = () => {
  store.setIsMousePositionForStartingCoordinates(true);
  store.setIsDrawing(false);
  if (shapeBeingDrawn)
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

const movingShape = (event) => {
  if (!shapeBeingMoved || !store.getControls().isMovingShape) return;
  const newX = event.clientX - store.getCanvasCoordinates().x;
  const newY = event.clientY - store.getCanvasCoordinates().y;
  shapeBeingMoved.x = newX;
  shapeBeingMoved.y = newY;
  clearCanvasAndRedrawAllShapes();
};

const handleCanvasClicked = (event) => {
  console.log("clicked");
  const allShapes = store.shapes;
  const x = event.clientX - store.getCanvasCoordinates().x;
  const y = event.clientY - store.getCanvasCoordinates().y;
  let isShapeSelected = false;
  for (let i = allShapes.length - 1; i >= 0; i--) {
    const shapeType = allShapes[i].constructor.name;
    switch (shapeType) {
      case "Rectangle":
        if (insideRectangle(allShapes[i], x, y)) {
          shapeBeingMoved = allShapes[i];
          // manager.executeCommand(new MoveShapeCommand(store, shapeBeingMoved));
        }
        break;
      case "Circle":
        if (insideCircle(allShapes[i], x, y)) {
          shapeBeingMoved = allShapes[i];
          // manager.executeCommand(new MoveShapeCommand(store, shapeBeingMoved));
        }
        break;
      default:
        console.log("Unknown shape in list");
    }
    if (isShapeSelected) break;
  }
};

// Event listeners
window.addEventListener("load", computeCanvasPosition);
canvas.addEventListener("mousedown", (event) => {
  beginDrawing(event);
});

canvas.addEventListener("mousemove", (event) => {
  drawing(event);
});

canvas.addEventListener("mouseup", () => {
  endDrawing();
});

document.getElementById("btn-select").addEventListener("click", () => {
  canvas.classList.remove("canvas-drawing");
});

drawingTools.forEach((tool) => {
  document.getElementById(tool.id).addEventListener("click", () => {
    store.setShapeSelectedToDraw(tool.shape);
    canvas.classList.add("canvas-drawing");
  });
});

document.getElementById("btn-undo").addEventListener("click", undo);
document.getElementById("btn-redo").addEventListener("click", redo);

/**
 * shapedSelectedToDraw, shapedSelectedToMove
 * drawingToolEnabled, selectToolEnabled
 *
 * Click on shape tool
 *  -> drawingToolEnabled: true,
 *  -> shapeSelectedToDraw: Rectangle | Circle | Line ...
 *  -> selectToolEnabled: false
 *
 * Click on select tool
 *  -> drawingToolEnabled: false
 *  -> shapeSelectedToDraw: none
 *  -> selectToolEnabled: true
 *
 * # Mousedown on canvas
 * if drawingToolEnabled -> beginDrawing
 * if selectToolEnabled -> beginSelecting
 *
 * # Mousemove on canvas
 * if drawingToolEnabled -> draw shapeSelectedToDraw
 * if selectToolEnabled AND shapeSelectedToMove -> moven shapeSelectedToMove
 *
 * # Mouseup on canvas
 * if drawingToolEnabled -> endDrawing
 * if selectToolEnabled if shapeSelectedToMove -> endMoving
 */
