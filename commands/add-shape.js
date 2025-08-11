export class AddShapeCommand {
  constructor(store, shape) {
    this.store = store;
    this.shape = shape;
  }
  execute() {
    this.store.shapes.push(this.shape);
  }

  undo() {
    this.store.shapes.pop();
  }
}
