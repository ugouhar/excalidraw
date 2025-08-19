import { SELECTION } from "../constants.js";

export class SelectShape {
  static count = 0;
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = SELECTION;
  }

  draw(ctx) {
    const path = new Path2D();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = "1";
    ctx.setLineDash([5, 5]);

    path.rect(this.x, this.y, this.w, this.h);
    ctx.stroke(path);
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.setLineDash([]);
  }
}

// Todo
// class for ctx
