const drawPathArr = (ctx, arr) => {
  ctx.lineCap = "round";
  ctx.lineWidth = "2";
  const path = new Path2D();
  for (let i = 0; i < arr.length - 1; i++) {
    const x1 = arr[i].x;
    const y1 = arr[i].y;
    const x2 = arr[i + 1].x;
    const y2 = arr[i + 1].y;
    path.moveTo(x1, y1);
    path.lineTo(x2, y2);
  }
  ctx.stroke(path);
  ctx.lineCap = "butt";
  ctx.lineWidth = "2";
};

export class FreehandView {
  static count = 0;
  static arr = [];
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    FreehandView.arr.push({ x: this.x, y: this.y });
  }

  draw(ctx) {
    drawPathArr(ctx, FreehandView.arr);
  }
}

export class Freehand {
  constructor() {
    this.arr = [...FreehandView.arr];
    FreehandView.arr = [];
  }
  draw(ctx) {
    drawPathArr(ctx, this.arr);
  }
}
