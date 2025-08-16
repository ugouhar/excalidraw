export class Arrow {
  static count = 0;
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.id = `line${Arrow.count++}`;
  }

  draw(ctx) {
    const x1 = this.x1;
    const y1 = this.y1;
    const x2 = this.x2;
    const y2 = this.y2;
    const ah = 8;
    const angle = 45;

    const dx = x2 - x1,
      dy = y2 - y1;
    const L = Math.hypot(dx, dy);
    const ux = dx / L,
      uy = dy / L;

    const cos = Math.cos(angle),
      sin = Math.sin(angle);

    // rotated vectors
    const rx1 = ux * cos + uy * sin;
    const ry1 = -ux * sin + uy * cos;
    const rx2 = ux * cos - uy * sin;
    const ry2 = ux * sin + uy * cos;

    const ax1 = x2 - ah * rx1,
      ay1 = y2 - ah * ry1;
    const ax2 = x2 - ah * rx2,
      ay2 = y2 - ah * ry2;

    const path = new Path2D();
    path.moveTo(x1, y1);
    path.lineTo(x2, y2); // main line
    path.lineTo(ax1, ay1);
    path.moveTo(x2, y2); // arrowhead side 1
    path.lineTo(ax2, ay2); // arrowhead side 2

    ctx.stroke(path);
  }
}
