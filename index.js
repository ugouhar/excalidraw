import { Rectangle } from "./shapes/rectangle.js";
import { store } from "./store.js";

const canvas = document.getElementById("canvas");

function computeCanvasPosition() {
  const canvasComputedStyle = getComputedStyle(canvas);
  const x_coordinate = parseInt(canvasComputedStyle.left.replace("px", ""));
  const y_coordinate = parseInt(canvasComputedStyle.top.replace("px", ""));

  store.setCanvasCoordinates({
    x: x_coordinate,
    y: y_coordinate,
  });
}

const onLoadHandler = () => {
  computeCanvasPosition();
};

const rectangle = new Rectangle(canvas);
function drawRectangle(event) {
  if (!store.getState().controls.isDrawingEnabled) return;
  rectangle.startDrawing(event);
  rectangle.clearPrevRectangle();
  rectangle.drawNewRectangle(event);
  rectangle.endDrawing();
}

const canvasMousedownHandler = () => {
  store.setIsDrawingEnabled(true);
};

const canvasMouseUpHandler = () => {
  store.setIsDrawingEnabled(false);
  store.setIsMousePositionForStartingCoordinates(true);

  rectangle.resetPreviousDimension();
  rectangle.addShapeToList(rectangle.getProperties());
};

window.addEventListener("load", onLoadHandler);
canvas.addEventListener("mousedown", canvasMousedownHandler);
canvas.addEventListener("mouseup", canvasMouseUpHandler);
canvas.addEventListener("mousemove", drawRectangle);
