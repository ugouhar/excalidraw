import { ARROW, CIRCLE, LINE, RECTANGLE } from "../constants.js";

export class MoveShapeCommand {
  static undoStack = [];
  static redoStack = [];
  constructor(store, shape) {
    this.store = store;
    this.shape = shape;
    this.shapeType = shape.type;
  }

  execute() {
    const N = MoveShapeCommand.undoStack.length;
    const top =
      N > 0 ? MoveShapeCommand.undoStack[N - 1] : { id: "", x: "", y: "" };

    if (this.shapeType === RECTANGLE || this.shapeType === CIRCLE) {
      if (
        top.id === this.shape.id &&
        top.x === this.shape.x &&
        top.y === this.shape.y
      ) {
        return;
      }
    }

    if (this.shapeType === LINE || this.shapeType === ARROW) {
      if (
        top.id === this.shape.id &&
        top.x1 === this.shape.x1 &&
        top.y1 === this.shape.y1 &&
        top.x2 === this.shape.x2 &&
        top.y2 === this.shape.y2
      ) {
        return;
      }
    }

    if (this.shapeType === RECTANGLE || this.shapeType === CIRCLE) {
      MoveShapeCommand.undoStack.push({
        id: this.shape.id,
        x: this.shape.x,
        y: this.shape.y,
      });
    }

    if (this.shapeType === LINE || this.shapeType === ARROW) {
      MoveShapeCommand.undoStack.push({
        id: this.shape.id,
        x1: this.shape.x1,
        y1: this.shape.y1,
        x2: this.shape.x2,
        y2: this.shape.y2,
      });
    }

    MoveShapeCommand.redoStack = [];
  }

  undo() {
    if (MoveShapeCommand.undoStack.length === 0) return;

    if (this.shapeType === RECTANGLE || this.shapeType === CIRCLE) {
      MoveShapeCommand.redoStack.push({
        id: this.shape.id,
        x: this.shape.x,
        y: this.shape.y,
      });

      const lastMovedShape = MoveShapeCommand.undoStack.pop();
      this.store.shapes.forEach((shape) => {
        if (shape.id === lastMovedShape.id) {
          shape.x = lastMovedShape.x;
          shape.y = lastMovedShape.y;
        }
      });
    }

    if (this.shapeType === LINE || this.shapeType === ARROW) {
      MoveShapeCommand.redoStack.push({
        id: this.shape.id,
        x1: this.shape.x1,
        y1: this.shape.y1,
        x2: this.shape.x2,
        y2: this.shape.y2,
      });

      const lastMovedShape = MoveShapeCommand.undoStack.pop();
      this.store.shapes.forEach((shape) => {
        if (shape.id === lastMovedShape.id) {
          shape.x1 = lastMovedShape.x1;
          shape.y1 = lastMovedShape.y1;
          shape.x2 = lastMovedShape.x2;
          shape.y2 = lastMovedShape.y2;
        }
      });
    }
  }

  redo() {
    if (MoveShapeCommand.redoStack.length === 0) return;

    if (this.shapeType === RECTANGLE || this.shapeType === CIRCLE) {
      MoveShapeCommand.undoStack.push({
        id: this.shape.id,
        x: this.shape.x,
        y: this.shape.y,
      });

      const lastMovedShape = MoveShapeCommand.redoStack.pop();
      this.store.shapes.forEach((shape) => {
        if (shape.id === lastMovedShape.id) {
          shape.x = lastMovedShape.x;
          shape.y = lastMovedShape.y;
        }
      });
    }
    if (this.shapeType === LINE || this.shapeType === ARROW) {
      MoveShapeCommand.undoStack.push({
        id: this.shape.id,
        x1: this.shape.x1,
        y1: this.shape.y1,
        x2: this.shape.x2,
        y2: this.shape.y2,
      });

      const lastMovedShape = MoveShapeCommand.redoStack.pop();
      this.store.shapes.forEach((shape) => {
        if (shape.id === lastMovedShape.id) {
          shape.x1 = lastMovedShape.x1;
          shape.y1 = lastMovedShape.y1;
          shape.x2 = lastMovedShape.x2;
          shape.y2 = lastMovedShape.y2;
        }
      });
    }
  }
}

// individual moveshape commands for each shape
