export class Store {
  constructor() {
    this.controls = {
      isMousePositionForStartingCoordinates: true,
      isDrawing: false,
    };
    this.canavas = {
      coordinates: {
        x: 0,
        y: 0,
      },
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

  setIsMousePositionForStartingCoordinates = (value) => {
    this.controls.isMousePositionForStartingCoordinates = value;
  };
  setIsDrawing = (isDrawing) => (this.controls.isDrawing = isDrawing);
  setCanvasCoordinates = (newCoordinates) => {
    this.canavas.coordinates = { ...newCoordinates };
  };
  setShapeSelectedToDraw = (newShape) => (this.shapeSelectedToDraw = newShape);
}

export const store = new Store();
