import { drawingTools } from "../constants.js";
import { store } from "../store.js";

export const registerPageLoadEvent = (computeCanvasPosition) => {
  window.addEventListener("load", computeCanvasPosition);
};

export const registerCanvasEvents = (
  canvas,
  beginDrawing,
  endDrawing,
  handleCanvasMouseDown,
  handleCanvasMouseMove
) => {
  // MOUSE DOWN
  canvas.addEventListener("mousedown", (event) => {
    store.setIsMouseDown(true);
    if (store.getTools().isDrawingToolEnabled) beginDrawing(event);
    if (!store.getTools().isDrawingToolEnabled) handleCanvasMouseDown(event);
  });

  // MOUSE MOVE
  canvas.addEventListener("mousemove", (event) => {
    handleCanvasMouseMove(event);
  });

  // MOUSE UP
  canvas.addEventListener("mouseup", (event) => {
    store.setIsMouseDown(false);
    if (store.getTools().isDrawingToolEnabled) endDrawing(event);
    if (store.getTools().isMoveToolEnabled) store.setIsMoveToolEnabled(false);
  });
};

export const registerToolsEvents = (canvas, undo, redo) => {
  document.getElementById("btn-select").addEventListener("click", () => {
    canvas.classList.remove("canvas-drawing");
    store.setIsSelectToolEnabled(true);
    store.setIsMoveToolEnabled(false);
    store.setIsDrawingToolEnabled(false);
  });

  drawingTools.forEach((tool) => {
    document.getElementById(tool.id).addEventListener("click", () => {
      store.setIsSelectToolEnabled(false);
      store.setIsMoveToolEnabled(false);
      store.setIsDrawingToolEnabled(true);
      store.setShapeSelectedToDraw(tool.shape);
      canvas.classList.add("canvas-drawing");
    });
  });

  document.getElementById("btn-undo").addEventListener("click", undo);
  document.getElementById("btn-redo").addEventListener("click", redo);
};
