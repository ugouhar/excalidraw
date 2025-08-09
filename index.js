import { Rectangle } from "./shapes/rectangle.js";
import { CanvasManager } from "./tools/canvas.js";

const canvas = document.getElementById("canvas");
const rectangle = new Rectangle(canvas);
const canvasManager = new CanvasManager(canvas, rectangle);

window.addEventListener("load", canvasManager.computeCanvasPosition);
