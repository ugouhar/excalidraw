import { GlobalValues } from "./global.js";
import { Rectangle } from "./shapes/rectangle.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function computeCanvasPosition() {
  const canvasComputedStyle = getComputedStyle(canvas);
  GlobalValues.canvasPosition.x = parseInt(
    canvasComputedStyle.left.replace("px", "")
  );
  GlobalValues.canvasPosition.y = parseInt(
    canvasComputedStyle.top.replace("px", "")
  );
}

function onLoadHandler() {
  computeCanvasPosition();
}
const rectangle = new Rectangle(canvas);
function drawRectangle(event) {
  if (!GlobalValues.controls.isDrawingEnabled) return;
  rectangle.startDrawing(event);
  rectangle.clearPrevRectangle();
  rectangle.drawNewRectangle(event);
  rectangle.endDrawing();
}

const canvasMousedownHandler = () => {
  GlobalValues.controls.isDrawingEnabled = true;
};

const canvasMouseUpHandler = () => {
  GlobalValues.controls.isDrawingEnabled = false;
  GlobalValues.controls.isMousePositionForStartingCoordinates = true;
  rectangle.resetPreviousSize();
};

window.addEventListener("load", onLoadHandler);

canvas.addEventListener("mousedown", canvasMousedownHandler);
canvas.addEventListener("mouseup", canvasMouseUpHandler);
canvas.addEventListener("mousemove", drawRectangle);
