export class AddShapeCommand {
  static undoStack = [];
  static redoStack = [];

  constructor(store, shape) {
    this.store = store;
    this.shape = shape;
  }

  execute() {
    this.store.shapes.push(this.shape);
    AddShapeCommand.undoStack.push(this.shape);
    AddShapeCommand.redoStack = [];
  }

  undo() {
    if (AddShapeCommand.undoStack.length === 0) return;
    const lastShape = AddShapeCommand.undoStack.pop();
    this.store.shapes.pop();
    AddShapeCommand.redoStack.push(lastShape);
  }

  redo() {
    if (AddShapeCommand.redoStack.length === 0) return;
    const lastShape = AddShapeCommand.redoStack.pop();
    this.store.shapes.push(lastShape);
    AddShapeCommand.undoStack.push(lastShape);
  }
}
