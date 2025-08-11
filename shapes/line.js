export class Line {
  static count = 0;
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.id = `line${Line.count++}`;
  }

  draw(ctx) {
    const path = new Path2D();
    path.moveTo(this.x1, this.y1);
    path.lineTo(this.x2, this.y2);
    ctx.stroke(path);
  }
}
