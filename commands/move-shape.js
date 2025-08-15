export class MoveShapeCommand {
  static undoStack = [];
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
      x: this.shape.x,
      y: this.shape.y,
      id: this.shape.id,
    });

    this.redoStack = [];
  }

  undo() {
    if (MoveShapeCommand.undoStack.length === 0) return;
    const last = MoveShapeCommand.undoStack.pop();
    this.store.shapes.forEach((shape) => {
      if (shape.id === last.id) {
        shape.x = last.x;
        shape.y = last.y;
      }
    });
  }

  redo() {
    // if (this.redoStack.length === 0) return;
    // const lastCoordinates = this.redoStack.pop();
    // this.shape.x = lastCoordinates.x;
    // this.shape.y = lastCoordinates.y;
    // this.undoStack.push({ x: lastCoordinates.x, y: lastCoordinates.y });
  }
}
// normal undo is working
// undo then moving and then undo is not working
// implement redo
/**
 * When a shape is moved, store it's previous coordinates
 */
