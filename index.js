import { AddShapeCommand } from "./commands/add-shape.js";
import { CommandManager } from "./commands/command-manager.js";
import { store } from "./store.js";
import {
  Arrow,
  ARROW,
  Circle,
  CIRCLE,
  Line,
  LINE,
  Rectangle,
  RECTANGLE,
} from "./constants.js";
import {
  computeStartingCoordinatesForDrawing,
  drawArrow,
  drawCircle,
  drawLine,
  drawRectangle,
} from "./shapes/draw.js";
import { insideCircle, insideRectangle, overLine } from "./utils/utils.js";
import {
  registerCanvasEvents,
  registerPageLoadEvent,
  registerToolsEvents,
} from "./utils/event-listeners.js";
import { MoveShapeCommand } from "./commands/move-shape.js";

const canvas = document.getElementById("canvas");
const manager = new CommandManager();
const ctx = canvas.getContext("2d");
ctx.lineWidth = store.getBrushSize();
let shapeBeingDrawn = null;
let dragOffsetX = 0,
  dragOffsetY = 0;
let dragOffsetX1 = 0,
  dragOffsetY1 = 0;
let dragOffsetX2 = 0,
  dragOffsetY2 = 0;
let didShapeJustStartMoving = true;

const clearCanvasAndRedrawAllShapes = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  store.shapes.forEach((shape) => shape.draw(ctx));
};

const computeCanvasPosition = () => {
  const canvasComputedStyle = canvas.getBoundingClientRect();
  const { x, y } = canvasComputedStyle;
  store.setCanvasCoordinates({ x, y });
};

const beginDrawing = () => {
  if (store.getControls().isCursorAtDrawingStartPoint) {
    computeStartingCoordinatesForDrawing();
    store.setIsCursorAtDrawingStartPoint(false);
  }
};

const drawingShape = () => {
  switch (store.shapeSelectedToDraw) {
    case RECTANGLE:
      shapeBeingDrawn = drawRectangle();
      break;
    case CIRCLE:
      shapeBeingDrawn = drawCircle();
      break;

    case LINE:
      shapeBeingDrawn = drawLine();
      break;

    case ARROW:
      shapeBeingDrawn = drawArrow();
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

const beginMoving = () => {
  manager.executeCommand(new MoveShapeCommand(store, store.getShapeSelected()));
  didShapeJustStartMoving = false;
};

const movingShape = () => {
  if (!store.getShapeSelected()) return;

  const shapeType = store.getShapeSelected().constructor.name;
  if (shapeType === Rectangle || shapeType === Circle) {
    const newX = store.getCanvasCursorCoordinates().x - dragOffsetX;
    const newY = store.getCanvasCursorCoordinates().y - dragOffsetY;
    store.getShapeSelected().x = newX;
    store.getShapeSelected().y = newY;
  }
  if (shapeType === Line || shapeType === Arrow) {
    const newX1 = store.getCanvasCursorCoordinates().x - dragOffsetX1;
    const newY1 = store.getCanvasCursorCoordinates().y - dragOffsetY1;
    const newX2 = store.getCanvasCursorCoordinates().x - dragOffsetX2;
    const newY2 = store.getCanvasCursorCoordinates().y - dragOffsetY2;

    store.getShapeSelected().x1 = newX1;
    store.getShapeSelected().y1 = newY1;
    store.getShapeSelected().x2 = newX2;
    store.getShapeSelected().y2 = newY2;
  }

  clearCanvasAndRedrawAllShapes();
};

const endMoving = () => {
  store.setIsMoveToolEnabled(false);
  didShapeJustStartMoving = true;
};

const undo = () => {
  manager.undo();
  clearCanvasAndRedrawAllShapes();
};

const redo = () => {
  manager.redo();
  clearCanvasAndRedrawAllShapes();
};

const getShapeBelowCursor = () => {
  let shapeBelowCursor = null;
  const { x, y } = store.getCanvasCursorCoordinates();
  store.shapes.forEach((shape) => {
    const shapeType = shape.constructor.name;
    if (
      (shapeType === Rectangle && insideRectangle(shape, x, y)) ||
      (shapeType === Circle && insideCircle(shape, x, y)) ||
      (shapeType === Line && overLine(shape, x, y)) ||
      (shapeType === Arrow && overLine(shape, x, y))
    ) {
      shapeBelowCursor = shape;
    }
  });
  return shapeBelowCursor;
};

const handleCanvasMouseDown = () => {
  const shapeSelected = getShapeBelowCursor();

  if (shapeSelected) {
    store.setShapeSelected(shapeSelected);
    const shapeType = shapeSelected.constructor.name;
    if (shapeType === Rectangle || shapeType === Circle) {
      dragOffsetX = store.getCanvasCursorCoordinates().x - shapeSelected.x;
      dragOffsetY = store.getCanvasCursorCoordinates().y - shapeSelected.y;
    }
    if (shapeType === Line || shapeType === Arrow) {
      dragOffsetX1 = store.getCanvasCursorCoordinates().x - shapeSelected.x1;
      dragOffsetY1 = store.getCanvasCursorCoordinates().y - shapeSelected.y1;

      dragOffsetX2 = store.getCanvasCursorCoordinates().x - shapeSelected.x2;
      dragOffsetY2 = store.getCanvasCursorCoordinates().y - shapeSelected.y2;
    }
  }
};

const handleCanvasMouseMove = (event) => {
  store.setCanvasCursorCoordinates({
    x: event.clientX - store.getCanvasCoordinates().x,
    y: event.clientY - store.getCanvasCoordinates().y,
  });

  if (store.getControls().isMouseDown && store.getTools().isDrawingToolEnabled)
    drawingShape();

  if (store.getControls().isMouseDown && store.getTools().isMoveToolEnabled) {
    if (didShapeJustStartMoving) beginMoving();
    else movingShape();
  }

  if (!store.getTools().isDrawingToolEnabled && getShapeBelowCursor()) {
    store.setIsMoveToolEnabled(true);
    canvas.classList.add("cursor-move");
  } else {
    store.setIsMoveToolEnabled(false);
    canvas.classList.remove("cursor-move");
  }
};

registerPageLoadEvent(computeCanvasPosition);
registerCanvasEvents(
  canvas,
  beginDrawing,
  endDrawing,
  endMoving,
  handleCanvasMouseDown,
  handleCanvasMouseMove
);
registerToolsEvents(canvas, undo, redo);
