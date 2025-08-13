import { AddShapeCommand } from "./commands/add-shape.js";
import { CommandManager } from "./commands/command-manager.js";
import { store } from "./store.js";
import {
  Circle,
  CIRCLE,
  drawingTools,
  LINE,
  Rectangle,
  RECTANGLE,
} from "./constants.js";
import {
  computeStartingCoordinatesForDrawing,
  drawCircle,
  drawLine,
  drawRectangle,
} from "./shapes/draw.js";
import {
  getCanvasCursorCoordinates,
  insideCircle,
  insideRectangle,
} from "./utils/utils.js";

const canvas = document.getElementById("canvas");
const manager = new CommandManager();
const ctx = canvas.getContext("2d");
ctx.lineWidth = store.getBrushSize();
let shapeBeingDrawn = null;
let shapeSelected = null;
let dragOffsetX = 0,
  dragOffsetY = 0;

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
  if (store.getControls().isCursorAtDrawingStartPoint) {
    computeStartingCoordinatesForDrawing(event);
    store.setIsCursorAtDrawingStartPoint(false);
  }
};

const drawing = (event) => {
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
  store.setIsCursorAtDrawingStartPoint(true);
  if (shapeBeingDrawn) {
    manager.executeCommand(new AddShapeCommand(store, shapeBeingDrawn));
  }
};

const undo = () => {
  manager.undo();
  clearCanvasAndRedrawAllShapes();
};

const redo = () => {
  manager.redo();
  clearCanvasAndRedrawAllShapes();
};

const getShapeBelowCursor = (event) => {
  let shapeBelowCursor = null;
  const { x, y } = getCanvasCursorCoordinates(event);
  store.shapes.forEach((shape) => {
    const shapeType = shape.constructor.name;
    if (
      (shapeType === Rectangle && insideRectangle(shape, x, y)) ||
      (shapeType === Circle && insideCircle(shape, x, y))
    ) {
      shapeBelowCursor = shape;
    }
  });
  return shapeBelowCursor;
};

const moveShape = (event) => {
  if (!shapeSelected) return;

  const newX = getCanvasCursorCoordinates(event).x - dragOffsetX;
  const newY = getCanvasCursorCoordinates(event).y - dragOffsetY;
  shapeSelected.x = newX;
  shapeSelected.y = newY;
  clearCanvasAndRedrawAllShapes();
};

const handleCanvasMouseDown = (event) => {
  shapeSelected = getShapeBelowCursor(event);
  if (shapeSelected) {
    dragOffsetX = getCanvasCursorCoordinates(event).x - shapeSelected.x;
    dragOffsetY = getCanvasCursorCoordinates(event).y - shapeSelected.y;
  }
};

const handleCanvasMouseMove = (event) => {
  if (store.getControls().isMouseDown && store.getTools().isDrawingToolEnabled)
    drawing(event);

  if (store.getControls().isMouseDown && store.getTools().isMoveToolEnabled)
    moveShape(event);

  if (!store.getTools().isDrawingToolEnabled && getShapeBelowCursor(event)) {
    store.setIsMoveToolEnabled(true);
    canvas.classList.add("cursor-move");
  } else {
    store.setIsMoveToolEnabled(false);
    canvas.classList.remove("cursor-move");
  }
};

// Event listeners
window.addEventListener("load", computeCanvasPosition);

// MOUSE DOWN
canvas.addEventListener("mousedown", (event) => {
  store.setIsMouseDown(true);
  if (store.getTools().isDrawingToolEnabled) beginDrawing(event);
  if (!store.getTools().isDrawingToolEnabled) handleCanvasMouseDown(event);
});

// MOUSE MOVE
canvas.addEventListener("mousemove", (event) => {
  handleCanvasMouseMove(event);
});

// MOUSE UP
canvas.addEventListener("mouseup", (event) => {
  store.setIsMouseDown(false);
  if (store.getTools().isDrawingToolEnabled) endDrawing(event);
  if (store.getTools().isMoveToolEnabled) store.setIsMoveToolEnabled(false);
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
