import { AddShapeCommand } from "./commands/add-shape.js";
import { CommandManager } from "./commands/command-manager.js";
import { store } from "./store.js";
import { Circle, CIRCLE, LINE, Rectangle, RECTANGLE } from "./constants.js";
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
import {
  registerCanvasEvents,
  registerPageLoadEvent,
  registerToolsEvents,
} from "./utils/event-listeners.js";

const canvas = document.getElementById("canvas");
const manager = new CommandManager();
const ctx = canvas.getContext("2d");
ctx.lineWidth = store.getBrushSize();
let shapeBeingDrawn = null;
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
  if (!store.getShapeSelected()) return;

  const newX = getCanvasCursorCoordinates(event).x - dragOffsetX;
  const newY = getCanvasCursorCoordinates(event).y - dragOffsetY;
  store.getShapeSelected().x = newX;
  store.getShapeSelected().y = newY;
  clearCanvasAndRedrawAllShapes();
};

const handleCanvasMouseDown = (event) => {
  store.setShapeSelected(getShapeBelowCursor(event));
  if (store.getShapeSelected()) {
    dragOffsetX =
      getCanvasCursorCoordinates(event).x - store.getShapeSelected().x;
    dragOffsetY =
      getCanvasCursorCoordinates(event).y - store.getShapeSelected().y;
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

registerPageLoadEvent(computeCanvasPosition);

registerCanvasEvents(
  canvas,
  beginDrawing,
  endDrawing,
  handleCanvasMouseDown,
  handleCanvasMouseMove
);

registerToolsEvents(canvas, undo, redo);
