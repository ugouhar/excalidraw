export class MoveShapeCommand {
  static undoStack = [];
  static redoStack = [];
  constructor(store, shape) {
    this.store = store;
    this.shape = shape;
  }

  execute() {
    const N = MoveShapeCommand.undoStack.length;
    const top =
      N > 0 ? MoveShapeCommand.undoStack[N - 1] : { id: "", x: "", y: "" };

    if (
      top.id === this.shape.id &&
      top.x === this.shape.x &&
      top.y === this.shape.y
    ) {
      return;
    }

    MoveShapeCommand.undoStack.push({
      id: this.shape.id,
      x: this.shape.x,
      y: this.shape.y,
    });

    MoveShapeCommand.redoStack = [];
  }

  undo() {
    if (MoveShapeCommand.undoStack.length === 0) return;
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

  redo() {
    if (MoveShapeCommand.redoStack.length === 0) return;
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
}
