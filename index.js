import { AddShapeCommand } from "./commands/add-shape.js";
import { CommandManager } from "./commands/command-manager.js";
import { store } from "./store.js";
import { ARROW, CIRCLE, LINE, RECTANGLE } from "./constants.js";
import {
  computeStartingCoordinatesForDrawing,
  drawArrow,
  drawCircle,
  drawLine,
  drawRectangle,
} from "./shapes/draw.js";
import { areCursorCoordinatesInsideShape } from "./utils/utils.js";
import {
  registerCanvasEvents,
  registerPageLoadEvent,
  registerToolsEvents,
} from "./utils/event-listeners.js";
import { MoveShapeCommand } from "./commands/move-shape.js";

const canvas = document.getElementById("canvas");
const manager = new CommandManager();
const ctx = canvas.getContext("2d");
let shapeBeingDrawn = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragOffsetX1 = 0;
let dragOffsetY1 = 0;
let dragOffsetX2 = 0;
let dragOffsetY2 = 0;
let didShapeJustStartMoving = true;

const setBrushSize = () => {
  ctx.lineWidth = store.getBrushSize();
};

const redrawCanvas = () => {
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
  switch (store.getShapeSelectedToDraw()) {
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

  redrawCanvas();
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
  const shapeSelected = store.getShapeSelected();
  if (!shapeSelected) return;

  const { x: cx, y: cy } = store.getCanvasCursorCoordinates();
  const shapeType = shapeSelected.type;

  if (shapeType === RECTANGLE || shapeType === CIRCLE) {
    shapeSelected.x = cx - dragOffsetX;
    shapeSelected.y = cy - dragOffsetY;
  }

  if (shapeType === LINE || shapeType === ARROW) {
    shapeSelected.x1 = cx - dragOffsetX1;
    shapeSelected.y1 = cy - dragOffsetY1;
    shapeSelected.x2 = cx - dragOffsetX2;
    shapeSelected.y2 = cy - dragOffsetY2;
  }

  redrawCanvas();
};

const endMoving = () => {
  store.setIsMoveToolEnabled(false);
  didShapeJustStartMoving = true;
};

const undo = () => {
  manager.undo();
  redrawCanvas();
};

const redo = () => {
  manager.redo();
  redrawCanvas();
};

const getShapeBelowCursor = () => {
  let shapeBelowCursor = null;
  store.shapes.forEach((shape) => {
    if (areCursorCoordinatesInsideShape(shape)) {
      shapeBelowCursor = shape;
    }
  });
  return shapeBelowCursor;
};

const handleCanvasMouseDown = () => {
  const shapeSelected = getShapeBelowCursor();
  const { x: cx, y: cy } = store.getCanvasCursorCoordinates();

  if (shapeSelected) {
    store.setShapeSelected(shapeSelected);
    const shapeType = shapeSelected.type;
    if (shapeType === RECTANGLE || shapeType === CIRCLE) {
      dragOffsetX = cx - shapeSelected.x;
      dragOffsetY = cy - shapeSelected.y;
    }
    if (shapeType === LINE || shapeType === ARROW) {
      dragOffsetX1 = cx - shapeSelected.x1;
      dragOffsetY1 = cy - shapeSelected.y1;

      dragOffsetX2 = cx - shapeSelected.x2;
      dragOffsetY2 = cy - shapeSelected.y2;
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

registerPageLoadEvent(computeCanvasPosition, setBrushSize);
registerCanvasEvents(
  canvas,
  beginDrawing,
  endDrawing,
  endMoving,
  handleCanvasMouseDown,
  handleCanvasMouseMove
);
registerToolsEvents(canvas, undo, redo);

// Refactor this file
