import { store } from "../store.js";

export class MoveShapeCommand {
  constructor(store, shape) {
    this.store = store;
    this.shape = shape;
    this.previousCoordinates = [];
  }

  execute(event, dragOffsetX = 0, dragOffsetY = 0) {
    const newX = store.getCanvasCursorCoordinates().x - dragOffsetX;
    const newY = store.getCanvasCursorCoordinates().y - dragOffsetY;

    this.previousCoordinates.push({
      x: this.shape.x,
      y: this.shape.y,
    });

    this.shape.x = newX;
    this.shape.y = newY;
  }

  undo() {
    const lastCoordinates = this.previousCoordinates.pop();
    this.shape.x = lastCoordinates.x;
    this.shape.y = lastCoordinates.y;
  }
}
