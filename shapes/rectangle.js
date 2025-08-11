export class Rectangle {
  static count = 0;
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = `rectangle_${Rectangle.count++}`;
  }

  draw(ctx) {
    const path = new Path2D();
    path.rect(this.x, this.y, this.w, this.h);
    ctx.stroke(path);
  }
}

export class AddRectangleCommand {
  constructor(store, rectangle) {
    this.store = store;
    this.rectangle = rectangle;
  }

  execute() {
    this.store.shapes.push(this.rectangle);
  }

  undo() {
    this.store.shapes = this.store.shapes.filter(
      (shape) => shape.id !== this.rectangle.id
    );
  }
}
