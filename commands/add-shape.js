export class AddShapeCommand {
  constructor(store, shape) {
    this.store = store;
    this.shape = shape;
  }
  execute() {
    this.store.shapes.push(this.shape);
  }

  undo() {
    this.store.shapes = this.store.shapes.filter(
      (shape) => shape.id !== this.shape.id
    );
  }
}
