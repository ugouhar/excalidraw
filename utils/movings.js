import { CommandManager } from "../commands/command-manager.js";
import { MoveShapeCommand } from "../commands/move-shape.js";
import { ARROW, CIRCLE, LINE, RECTANGLE } from "../constants.js";
import { store } from "../store.js";
import { Drawing } from "./drawing.js";
const manager = new CommandManager();

let isShapeAboutToMove = true;
const dragOffsets = {
  x: 0,
  y: 0,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
};

export class MovingShape {
  static beginMoving = () => {
    manager.executeCommand(
      new MoveShapeCommand(store, store.getShapeSelected())
    );
    isShapeAboutToMove = false;
  };

  static moveShape = (canvas) => {
    const shapeSelected = store.getShapeSelected();
    if (!shapeSelected) return;

    const { x: cx, y: cy } = store.getCanvasCursorCoordinates();
    const shapeType = shapeSelected.type;

    if (shapeType === RECTANGLE || shapeType === CIRCLE) {
      shapeSelected.x = cx - dragOffsets.x;
      shapeSelected.y = cy - dragOffsets.y;
    }

    if (shapeType === LINE || shapeType === ARROW) {
      shapeSelected.x1 = cx - dragOffsets.x1;
      shapeSelected.y1 = cy - dragOffsets.y1;
      shapeSelected.x2 = cx - dragOffsets.x2;
      shapeSelected.y2 = cy - dragOffsets.y2;
    }

    Drawing.redrawCanvas(canvas);
  };

  static endMoving = () => {
    store.setIsMoveToolEnabled(false);
    isShapeAboutToMove = true;
  };

  static checkCanMoveShape = (canvas) => {
    if (
      store.getControls().isMouseDown &&
      store.getTools().isMoveToolEnabled &&
      store.getShapeSelected()
    ) {
      if (isShapeAboutToMove) MovingShape.beginMoving();
      else MovingShape.moveShape(canvas);
    }
  };

  static setDragOffsets = () => {
    const shapeSelected = store.getShapeSelected();

    if (!shapeSelected) return;

    const { x: cx, y: cy } = store.getCanvasCursorCoordinates();
    const shapeType = shapeSelected.type;

    if (shapeType === RECTANGLE || shapeType === CIRCLE) {
      dragOffsets.x = cx - shapeSelected.x;
      dragOffsets.y = cy - shapeSelected.y;
    }

    if (shapeType === LINE || shapeType === ARROW) {
      dragOffsets.x1 = cx - shapeSelected.x1;
      dragOffsets.y1 = cy - shapeSelected.y1;

      dragOffsets.x2 = cx - shapeSelected.x2;
      dragOffsets.y2 = cy - shapeSelected.y2;
    }
  };
}
