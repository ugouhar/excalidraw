import { AddShapeCommand } from "./commands/add-shape.js";
import { Circle } from "./shapes/circle.js";
import { CommandManager } from "./commands/command-manager.js";
import { Rectangle } from "./shapes/rectangle.js";
import { Store } from "./store.js";
import { CIRCLE, drawingTools, LINE, RECTANGLE } from "./constants.js";
import { Line } from "./shapes/line.js";

const canvas = document.getElementById("canvas");
const store = new Store();
const manager = new CommandManager();
const ctx = canvas.getContext("2d");
ctx.lineWidth = 2;
let startX, startY;
let shapeBeingDrawn = null;

const clearCanvasAndRedrawAllShapes = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  store.shapes.forEach((shape) => shape.draw(ctx));
};

const computeCanvasPosition = () => {
  const canvasComputedStyle = canvas.getBoundingClientRect();
  const { x, y } = canvasComputedStyle;
  store.setCanvasCoordinates({ x, y });
};

const computeStartingCoordinates = (event) => {
  startX = event.clientX - store.getCanvasCoordinates().x;
  startY = event.clientY - store.getCanvasCoordinates().y;
};

const beginDrawing = (event) => {
  store.setIsDrawing(true);
  if (store.getControls().isMousePositionForStartingCoordinates) {
    computeStartingCoordinates(event);
    store.setIsMousePositionForStartingCoordinates(false);
  }
};

const drawRectangle = (event) => {
  const width = event.clientX - store.getCanvasCoordinates().x - startX;
  const height = event.clientY - store.getCanvasCoordinates().y - startY;
  shapeBeingDrawn = new Rectangle(startX, startY, width, height);
};

const drawCircle = (event) => {
  const radius = Math.abs(
    event.clientX - store.getCanvasCoordinates().x - startX
  );
  shapeBeingDrawn = new Circle(startX, startY, radius);
};

const drawLine = (event) => {
  const x2 = event.clientX - store.getCanvasCoordinates().x;
  const y2 = event.clientY - store.getCanvasCoordinates().y;
  shapeBeingDrawn = new Line(startX, startY, x2, y2);
};

const drawing = (event) => {
  if (!store.getControls().isDrawing) return;

  const shapeSelectedToDraw = store.shapeSelectedToDraw;

  if (shapeSelectedToDraw === RECTANGLE) drawRectangle(event);
  if (shapeSelectedToDraw === CIRCLE) drawCircle(event);
  if (shapeSelectedToDraw === LINE) drawLine(event);

  clearCanvasAndRedrawAllShapes();
  if (shapeBeingDrawn) shapeBeingDrawn.draw(ctx);
};

const endDrawing = () => {
  store.setIsMousePositionForStartingCoordinates(true);
  store.setIsDrawing(false);
  manager.executeCommand(new AddShapeCommand(store, shapeBeingDrawn));
};

const undo = () => {
  manager.undo();
  clearCanvasAndRedrawAllShapes();
};

const redo = () => {
  manager.redo();
  clearCanvasAndRedrawAllShapes();
};

window.addEventListener("load", computeCanvasPosition);
canvas.addEventListener("mousedown", beginDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", endDrawing);
drawingTools.forEach((tool) => {
  document
    .getElementById(tool.id)
    .addEventListener("click", () => store.setShapeSelectedToDraw(tool.shape));
});
document.getElementById("btn-undo").addEventListener("click", undo);
document.getElementById("btn-redo").addEventListener("click", redo);
