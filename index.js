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
import { AddShapeCommand } from "./commands/add-shape.js";
import { SelectShape } from "./shapes/selections.js";
import { CIRCLE, RECTANGLE, SELECTION } from "./constants.js";

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

const handleCanvasClick = () => {
  store.shapes = store.shapes.filter((s) => s.type !== SELECTION);
  const shape = store.getShapeSelected();
  if (!shape) {
    Drawing.redrawCanvas(canvas);
    return;
  }
  const shapeType = shape.type;
  let x, y, w, h;
  if (shapeType === RECTANGLE) {
    x = shape.x - 5;
    y = shape.y - 5;
    w = shape.w + 10;
    h = shape.h + 10;
  } else if (shapeType === CIRCLE) {
    x = shape.x - shape.radius - 5;
    y = shape.y - shape.radius - 5;
    w = shape.radius * 2 + 10;
    h = shape.radius * 2 + 10;
  } else {
    return;
  }
  const selection = new SelectShape(x, y, w, h);
  manager.executeCommand(new AddShapeCommand(store, selection));
  Drawing.redrawCanvas(canvas);
};

registerPageLoadEvent(computeCanvasPosition, setBrushSize);
registerCanvasEvents(
  canvas,
  MovingShape.endMoving,
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasClick
);
registerToolsEvents(canvas, undo, redo);

// move utilities to utils
// better names than checkCanMoveShape, checkCan..
// handleCanvasMouseDown only on mousedown
