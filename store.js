export class Store {
  constructor() {
    this.controls = {
      isMousePositionForStartingCoordinates: true,
      isDrawing: false,
      isMovingShape: false,
    };
    this.canavas = {
      coordinates: {
        x: 0,
        y: 0,
      },
      brushSize: 50,
    };
    this.shapes = [];
    this.shapeSelectedToDraw = "RECTANGLE";
  }
  getState = () => ({
    controls: this.controls,
    canvas: this.canavas,
    shapes: this.shapes,
  });
  getControls = () => this.controls;
  getCanvasCoordinates = () => this.canavas.coordinates;
  getBrushSize = () => this.canavas.brushSize;

  setIsMousePositionForStartingCoordinates = (value) => {
    this.controls.isMousePositionForStartingCoordinates = value;
  };
  setIsDrawing = (isDrawing) => (this.controls.isDrawing = isDrawing);
  setIsMovingShape = (isMoving) => (this.controls.isMovingShape = isMoving);
  setCanvasCoordinates = (newCoordinates) => {
    this.canavas.coordinates = { ...newCoordinates };
  };
  setShapeSelectedToDraw = (newShape) => (this.shapeSelectedToDraw = newShape);
}

export const store = new Store();
