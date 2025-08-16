export class Pencil {
  static count = 0;
  static arr = [];
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    Pencil.arr.push({ x: this.x, y: this.y });
  }

  draw(ctx) {
    ctx.lineCap = "round";
    ctx.lineWidth = "4";

    const path = new Path2D();
    for (let i = 0; i < Pencil.arr.length - 1; i++) {
      const x1 = Pencil.arr[i].x;
      const y1 = Pencil.arr[i].y;
      const x2 = Pencil.arr[i + 1].x;
      const y2 = Pencil.arr[i + 1].y;
      path.moveTo(x1, y1);
      path.lineTo(x2, y2);
    }
    ctx.stroke(path);
    ctx.lineWidth = "2";
  }
}
