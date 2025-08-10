import { CIRCLE, RECTANGLE } from "./constants.js";
import { Circle } from "./shapes/circle.js";
import { Rectangle } from "./shapes/rectangle.js";
import { CanvasManager } from "./tools/canvas.js";

const canvas = document.getElementById("canvas");
const rectangle = new Rectangle(canvas);
const circle = new Circle(canvas);
const canvasManager = new CanvasManager(canvas, rectangle, circle);

window.addEventListener("load", canvasManager.computeCanvasPosition);
document
  .getElementById("btn-rectangle")
  .addEventListener("click", () => canvasManager.setShape(RECTANGLE));
document
  .getElementById("btn-circle")
  .addEventListener("click", () => canvasManager.setShape(CIRCLE));
