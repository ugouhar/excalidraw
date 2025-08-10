import { store } from "../store.js";

export class Shape {
  constructor(canvas) {
    this.canvas = canvas;
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

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
