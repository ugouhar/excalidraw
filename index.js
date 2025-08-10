import { Circle } from "./shapes/circle.js";
import { Rectangle } from "./shapes/rectangle.js";
import { CanvasManager } from "./tools/canvas.js";

const canvas = document.getElementById("canvas");
const rectangle = new Rectangle(canvas);
const circle = new Circle(canvas);
const canvasManager = new CanvasManager(canvas, rectangle, circle);

window.addEventListener("load", canvasManager.computeCanvasPosition);
