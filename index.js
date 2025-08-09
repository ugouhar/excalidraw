import { RECTANGLE } from "./constants.js";
import { Rectangle } from "./shapes/rectangle.js";
import { store } from "./store.js";
import { Canvas } from "./tools/canvas.js";

const canvas = document.getElementById("canvas");
const canvasObj = new Canvas();
const rectangle = new Rectangle(canvas);

const drawShape = (event) => {
  if (!store.getControls().isDrawingEnabled) return;
  switch (store.getShapeSelectedToDraw()) {
    case RECTANGLE:
      rectangle.draw(event);
      break;
    default:
      console.log("Unknown shape");
  }
};

canvas.addEventListener("mousedown", canvasObj.canvasMousedownHandler);
canvas.addEventListener("mouseup", () => {
  switch (store.getShapeSelectedToDraw()) {
    case RECTANGLE:
      canvasObj.canvasMouseUpHandler(rectangle);
      break;
    default:
      console.log("Unknown shape");
  }
});
canvas.addEventListener("mousemove", drawShape);
window.addEventListener("load", () => canvasObj.computeCanvasPosition(canvas));
