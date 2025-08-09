import { store } from "../store.js";

export class Shape {
  constructor(canvas) {
    this.prevDimensions = {};
    this.startCoord = {
      x: 0,
      y: 0,
    };
    this.currDimensions = {};
    this.ctx = canvas.getContext("2d");
    this.list = [];
  }

  startDrawing(event) {
    if (store.getControls().isMousePositionForStartingCoordinates) {
      this.startCoord.x = event.clientX - store.getCanvasCoordinates().x;
      this.startCoord.y = event.clientY - store.getCanvasCoordinates().y;
      store.setIsMousePositionForStartingCoordinates(false);
    }
  }

  endDrawing() {
    this.prevDimensions = { ...this.currDimensions };
  }

  getProperties() {
    return {
      x: this.startCoord.x,
      y: this.startCoord.y,
      ...this.currDimensions,
    };
  }

  addShapeToList(shape) {
    this.list.push(shape);
  }
}
