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
let shapeSelected = null;

const clearCanvasAndRedrawAllShapes = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  store.shapes.forEach((shape) => shape.draw(ctx));
};

const computeCanvasPosition = () => {
  const canvasComputedStyle = canvas.getBoundingClientRect();
  const { x, y } = canvasComputedStyle;
  store.setCanvasCoordinates({ x, y });
};

const beginSelecting = (event) => {};

const selecting = (event) => {};
const endSelecting = (event) => {};

const beginMoving = (event) => {};
const moving = (event) => {};
const endMoving = (event) => {};

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

let deltaX = 0,
  deltaY = 0;
const movingShape = (event) => {
  if (!shapeSelected) return;

  const newX = event.clientX - store.getCanvasCoordinates().x - deltaX;
  const newY = event.clientY - store.getCanvasCoordinates().y - deltaY;
  shapeSelected.x = newX;
  shapeSelected.y = newY;
  clearCanvasAndRedrawAllShapes();
};

const handleCanvasMouseDown = (event) => {
  shapeSelected = null;
  const allShapes = store.shapes;
  const x = event.clientX - store.getCanvasCoordinates().x;
  const y = event.clientY - store.getCanvasCoordinates().y;
  let isShapeSelected = false;
  for (let i = 0; i < allShapes.length; i++) {
    const shapeType = allShapes[i].constructor.name;
    switch (shapeType) {
      case "Rectangle":
        if (insideRectangle(allShapes[i], x, y)) {
          shapeSelected = allShapes[i];
          // manager.executeCommand(new MoveShapeCommand(store, shapeBeingMoved));
        }
        break;
      case "Circle":
        if (insideCircle(allShapes[i], x, y)) {
          shapeSelected = allShapes[i];
          // manager.executeCommand(new MoveShapeCommand(store, shapeBeingMoved));
        }
        break;
      default:
        console.log("Unknown shape in list");
    }
    if (isShapeSelected) break;
  }

  clearCanvasAndRedrawAllShapes();
  if (shapeSelected) {
    shapeSelected.draw(ctx);
    deltaX = event.clientX - store.getCanvasCoordinates().x - shapeSelected.x;
    deltaY = event.clientY - store.getCanvasCoordinates().y - shapeSelected.y;
  }
  ctx.strokeStyle = "black";
};

const handleCanvasMouseMove = (event) => {
  if (store.getTools().isDrawingToolEnabled) drawing(event);

  const allShapes = store.shapes;
  const x = event.clientX - store.getCanvasCoordinates().x;
  const y = event.clientY - store.getCanvasCoordinates().y;
  store.setIsMoveToolEnabled(false);
  let shouldContinue = true;
  for (let i = 0; i < allShapes.length; i++) {
    const shapeType = allShapes[i].constructor.name;
    switch (shapeType) {
      case "Rectangle":
        if (insideRectangle(allShapes[i], x, y)) {
          store.setIsMoveToolEnabled(true);
          shouldContinue = false;
        }
        break;
      case "Circle":
        if (insideCircle(allShapes[i], x, y)) {
          store.setIsMoveToolEnabled(true);
          shouldContinue = false;
        }
        break;
      default:
        console.log("Unknown shape in list");
    }
    if (!shouldContinue) break;
  }
  if (store.getTools().isMoveToolEnabled) {
    canvas.classList.add("cursor-move");
  } else {
    canvas.classList.remove("cursor-move");
  }
  if (store.getControls().isMovingShape) movingShape(event);
};

// Event listeners
window.addEventListener("load", computeCanvasPosition);

canvas.addEventListener("click", (event) => {
  // handleCanvasClicked(event);
});

canvas.addEventListener("mousedown", (event) => {
  // if (store.getTools().isSelectToolEnabled) beginSelecting(event);
  // if (store.getTools().isMoveToolEnabled) beginMoving(event);
  if (store.getTools().isDrawingToolEnabled) beginDrawing(event);
  if (store.getTools().isMoveToolEnabled) store.setIsMovingShape(true);
  if (!store.getTools().isDrawingToolEnabled) handleCanvasMouseDown(event);
});

canvas.addEventListener("mousemove", (event) => {
  // if (store.getTools().isSelectToolEnabled) selecting(event);
  // if (store.getTools().isMoveToolEnabled) moving(event);
  handleCanvasMouseMove(event);
});

canvas.addEventListener("mouseup", (event) => {
  // if (store.getTools().isSelectToolEnabled) endSelecting(event);
  // if (store.getTools().isMoveToolEnabled) endMoving(event);
  if (store.getTools().isDrawingToolEnabled) endDrawing(event);
  if (store.getTools().isMoveToolEnabled) store.setIsMovingShape(false);
});

document.getElementById("btn-select").addEventListener("click", () => {
  canvas.classList.remove("canvas-drawing");
  store.setIsSelectToolEnabled(true);
  store.setIsMoveToolEnabled(false);
  store.setIsDrawingToolEnabled(false);
});

drawingTools.forEach((tool) => {
  document.getElementById(tool.id).addEventListener("click", () => {
    store.setIsSelectToolEnabled(false);
    store.setIsMoveToolEnabled(false);
    store.setIsDrawingToolEnabled(true);
    store.setShapeSelectedToDraw(tool.shape);
    canvas.classList.add("canvas-drawing");
  });
});

document.getElementById("btn-undo").addEventListener("click", undo);
document.getElementById("btn-redo").addEventListener("click", redo);

/**
 * shapesBeingSelected,
 * shapesBeingMoved
 * shapeBeingDrawn
 *
 * isSelectToolEnabled
 * isMoveToolEnabled -> this will be enabled only when there are shapes selected and cursor is inside boundary
 * isDrawingToolEnabled
 *
 * Click on select tool
 *  -> isSelectToolEnabled: true
 *  -> isMoveToolEnabled: false
 *  -> isDrawingToolEnabled: false
 *
 *
 * Click on drawing tool
 *  -> isSelectToolEnabled: false
 *  -> isMoveToolEnabled: false
 *  -> isDrawingToolEnabled: true,
 *  -> shapeBeingDrawn: Rectangle | Circle | Line ...
 *
 * # Mousedown on canvas
 * if isSelectToolEnabled -> beginSelecting()
 * if isMoveToolEnabled -> beginMoving()
 * if isDrawingToolEnabled -> beginDrawing()
 *
 *
 * # Mousemove on canvas
 * if isSelectToolEnabled -> selecting()
 * if isMoveToolEnabled -> moving()
 * if isDrawingToolEnabled -> drawing()
 *
 *
 * # Mouseup on canvas
 * if isSelectToolEnabled -> endSelecting()
 * if isMoveToolEnabled -> endMoving()
 * if isDrawingToolEnabled -> endDrawing()
 */
