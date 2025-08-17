import { RECTANGLE } from "../constants.js";

export class Rectangle {
  static count = 0;
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = RECTANGLE;
    this.id = `rectangle_${Rectangle.count++}`;
  }

  draw(ctx) {
    const path = new Path2D();
    path.rect(this.x, this.y, this.w, this.h);
    ctx.stroke(path);
  }
}
