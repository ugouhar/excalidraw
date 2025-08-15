export class AddShapeCommand {
  constructor(store, shape) {
    this.store = store;
    this.shape = shape;
    this.undoStack = [];
    this.redoStack = [];
  }
  execute() {
    this.store.shapes.push(this.shape);
    this.undoStack.push(this.shape);
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length === 0) return;
    const lastShape = this.undoStack.pop();
    this.store.shapes.pop();
    this.redoStack.push(lastShape);
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const lastShape = this.redoStack.pop();
    this.store.shapes.push(lastShape);
    this.undoStack.push(lastShape);
  }
}

// Todo: Update AddShape to use static undo redo
