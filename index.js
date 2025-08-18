import { CommandManager } from "./commands/command-manager.js";
import { store } from "./store.js";
import { areCursorCoordinatesInsideShape } from "./utils/utils.js";
import {
  registerCanvasEvents,
  registerPageLoadEvent,
  registerToolsEvents,
} from "./utils/event-listeners.js";
import { Drawing } from "./utils/drawing.js";
import { MovingShape } from "./utils/movings.js";

const canvas = document.getElementById("canvas");
const manager = new CommandManager();
const ctx = canvas.getContext("2d");

const setBrushSize = () => {
  ctx.lineWidth = store.getBrushSize();
};

const computeCanvasPosition = () => {
  const canvasComputedStyle = canvas.getBoundingClientRect();
  const { x, y } = canvasComputedStyle;
  store.setCanvasCoordinates({ x, y });
};

const undo = () => {
  manager.undo();
  Drawing.redrawCanvas(canvas);
};

const redo = () => {
  manager.redo();
  Drawing.redrawCanvas(canvas);
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

const checkCanEnableMoveCursorIcon = () => {
  if (store.getTools().isSelectToolEnabled && getShapeBelowCursor()) {
    store.setIsMoveToolEnabled(true);
    canvas.classList.add("cursor-move");
  } else {
    store.setIsMoveToolEnabled(false);
    canvas.classList.remove("cursor-move");
  }
};

const checkCanDraw = () => {
  if (store.getControls().isMouseDown && store.getTools().isDrawingToolEnabled)
    Drawing.drawShape(canvas);
};

const updateCanvasCursorCoordinates = (event) => {
  store.setCanvasCursorCoordinates({
    x: event.clientX - store.getCanvasCoordinates().x,
    y: event.clientY - store.getCanvasCoordinates().y,
  });
};

const handleCanvasMouseDown = () => {
  store.setShapeSelected(getShapeBelowCursor());
  MovingShape.setDragOffsets();
};

const handleCanvasMouseMove = (event) => {
  updateCanvasCursorCoordinates(event);
  checkCanEnableMoveCursorIcon();
  checkCanDraw();
  MovingShape.checkCanMoveShape(canvas);
};

registerPageLoadEvent(computeCanvasPosition, setBrushSize);
registerCanvasEvents(
  canvas,
  MovingShape.endMoving,
  handleCanvasMouseDown,
  handleCanvasMouseMove
);
registerToolsEvents(canvas, undo, redo);

// move utilities to utils
// better names than checkCanMoveShape, checkCan..
