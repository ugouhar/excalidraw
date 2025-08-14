import { CIRCLE, LINE, RECTANGLE } from "../constants.js";
import { store } from "../store.js";

export const registerPageLoadEvent = (computeCanvasPosition) => {
  window.addEventListener("load", computeCanvasPosition);
};

export const registerCanvasEvents = (
  canvas,
  beginDrawing,
  endDrawing,
  endMoving,
  handleCanvasMouseDown,
  handleCanvasMouseMove
) => {
  // MOUSE DOWN
  canvas.addEventListener("mousedown", () => {
    store.setIsMouseDown(true);
    if (store.getTools().isDrawingToolEnabled) beginDrawing();
    if (!store.getTools().isDrawingToolEnabled) handleCanvasMouseDown();
  });

  // MOUSE MOVE
  canvas.addEventListener("mousemove", handleCanvasMouseMove);

  // MOUSE UP
  canvas.addEventListener("mouseup", () => {
    store.setIsMouseDown(false);
    if (store.getTools().isDrawingToolEnabled) endDrawing();
    if (store.getTools().isMoveToolEnabled) endMoving();
  });
};

const switchActiveTool = (canvas, toolName) => {
  store.setIsSelectToolEnabled(toolName === "select-tool");
  store.setIsMoveToolEnabled(toolName === "move-tool");
  store.setIsDrawingToolEnabled(toolName === "drawing-tool");

  if (toolName === "drawing-tool") canvas.classList.add("canvas-drawing");
  else canvas.classList.remove("canvas-drawing");
};

export const registerToolsEvents = (canvas, undo, redo) => {
  document.getElementById("select-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "select-tool");
  });

  document.getElementById("rectangle-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "drawing-tool");
    store.setShapeSelectedToDraw(RECTANGLE);
  });

  document.getElementById("circle-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "drawing-tool");
    store.setShapeSelectedToDraw(CIRCLE);
  });

  document.getElementById("line-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "drawing-tool");
    store.setShapeSelectedToDraw(LINE);
  });

  document.getElementById("undo-tool").addEventListener("click", undo);
  document.getElementById("redo-tool").addEventListener("click", redo);
};
