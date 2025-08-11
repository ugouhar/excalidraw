export class Circle {
  static count = 0;
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.id = `circle${Circle.count++}`;
  }

  draw(ctx) {
    const path = new Path2D();
    path.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke(path);
  }
}

export class AddCircleCommand {
  constructor(store, circle) {
    this.store = store;
    this.circle = circle;
  }
  execute() {
    this.store.shapes.push(this.circle);
  }

  undo() {
    this.store.shapes = this.store.shapes.filter(
      (shape) => shape.id !== this.circle.id
    );
  }
}
