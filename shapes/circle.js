import { CIRCLE } from "../constants.js";

export class Circle {
  static count = 0;
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.type = CIRCLE;
    this.id = `circle${Circle.count++}`;
  }

  draw(ctx) {
    const path = new Path2D();
    path.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke(path);
  }
}
