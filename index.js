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
import { insideCircle, insideRectangle } from "./utils/utils.js";
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

const beginDrawing = () => {
  if (store.getControls().isCursorAtDrawingStartPoint) {
    computeStartingCoordinatesForDrawing();
    store.setIsCursorAtDrawingStartPoint(false);
  }
};

const drawing = () => {
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

const endMoving = () => {
  const shapeSelected = store.getShapeSelected();
  if (shapeSelected) {
    //
  }

  store.setIsMoveToolEnabled(false);
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
      (shapeType === Circle && insideCircle(shape, x, y))
    ) {
      shapeBelowCursor = shape;
    }
  });
  return shapeBelowCursor;
};

const moveShape = () => {
  if (!store.getShapeSelected()) return;

  const newX = store.getCanvasCursorCoordinates().x - dragOffsetX;
  const newY = store.getCanvasCursorCoordinates().y - dragOffsetY;
  store.getShapeSelected().x = newX;
  store.getShapeSelected().y = newY;
  clearCanvasAndRedrawAllShapes();
};

const handleCanvasMouseDown = () => {
  store.setShapeSelected(getShapeBelowCursor());
  if (store.getShapeSelected()) {
    dragOffsetX =
      store.getCanvasCursorCoordinates().x - store.getShapeSelected().x;
    dragOffsetY =
      store.getCanvasCursorCoordinates().y - store.getShapeSelected().y;
  }
};

const handleCanvasMouseMove = (event) => {
  store.setCanvasCursorCoordinates({
    x: event.clientX - store.getCanvasCoordinates().x,
    y: event.clientY - store.getCanvasCoordinates().y,
  });
  if (store.getControls().isMouseDown && store.getTools().isDrawingToolEnabled)
    drawing();

  if (store.getControls().isMouseDown && store.getTools().isMoveToolEnabled)
    moveShape();

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
