// import { store } from "../store.js";
// import { Shape } from "./shape.js";

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

  // startDrawing = (event) => {
  //   if (store.getControls().isMousePositionForStartingCoordinates) {
  //     this.startCoord.x = event.clientX - store.getCanvasCoordinates().x;
  //     this.startCoord.y = event.clientY - store.getCanvasCoordinates().y;
  //     store.setIsMousePositionForStartingCoordinates(false);
  //   }
  // };

  // draw2 = (event) => {
  //   // this.clearCanvas();
  //   this.startDrawing(event);

  //   this.dimensions.x = this.startCoord.x;
  //   this.dimensions.y = this.startCoord.y;
  //   this.dimensions.width =
  //     event.clientX - store.getCanvasCoordinates().x - this.startCoord.x;
  //   this.dimensions.height =
  //     event.clientY - store.getCanvasCoordinates().y - this.startCoord.y;

  //   const path = new Path2D();
  //   path.rect(
  //     this.dimensions.x,
  //     this.dimensions.y,
  //     this.dimensions.width,
  //     this.dimensions.height
  //   );

  // if (Shape.list.length > 0) Shape.list.pop();
  // Shape.list.push({
  //   path,
  //   dimensions: this.dimensions,
  // });

  // this.redrawAllShapes();
  // };
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
