import { RECTANGLE } from "../constants.js";
import { store } from "../store.js";

export class Canvas {
  computeCanvasPosition = (canvas) => {
    const canvasComputedStyle = getComputedStyle(canvas);
    const x_coordinate = parseInt(canvasComputedStyle.left.replace("px", ""));
    const y_coordinate = parseInt(canvasComputedStyle.top.replace("px", ""));

    store.setCanvasCoordinates({
      x: x_coordinate,
      y: y_coordinate,
    });
  };

  canvasMousedownHandler = () => {
    store.setIsDrawingEnabled(true);
  };

  canvasMouseUpHandler = (currentShape) => {
    store.setIsDrawingEnabled(false);
    store.setIsMousePositionForStartingCoordinates(true);
    switch (store.getShapeSelectedToDraw()) {
      case RECTANGLE:
        currentShape.resetPreviousDimension();
        currentShape.addShapeToList(currentShape.getProperties());
        break;
      default:
        console.log("Unknown shape");
    }
  };
}
