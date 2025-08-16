import { ARROW, CIRCLE, LINE, PENCIL, RECTANGLE, TEXT } from "../constants.js";
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

const switchActiveTool = (canvas, toolType, toolName) => {
  store.setIsSelectToolEnabled(toolType === "select-tool");
  store.setIsMoveToolEnabled(toolType === "move-tool");
  store.setIsDrawingToolEnabled(toolType === "drawing-tool");

  if (toolType === "drawing-tool") canvas.classList.add("canvas-drawing");
  else canvas.classList.remove("canvas-drawing");

  const allTools = [
    "select-tool",
    "rectangle-tool",
    "circle-tool",
    "arrow-tool",
    "line-tool",
    "pencil-tool",
    "text-tool",
  ];

  allTools.forEach((tool) =>
    document.getElementById(tool).classList.remove("active-tool")
  );
  document.getElementById(toolName).classList.add("active-tool");
};

export const registerToolsEvents = (canvas, undo, redo) => {
  document.getElementById("select-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "select-tool", "select-tool");
  });

  document.getElementById("rectangle-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "drawing-tool", "rectangle-tool");
    store.setShapeSelectedToDraw(RECTANGLE);
  });

  document.getElementById("circle-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "drawing-tool", "circle-tool");
    store.setShapeSelectedToDraw(CIRCLE);
  });

  document.getElementById("arrow-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "drawing-tool", "arrow-tool");
    store.setShapeSelectedToDraw(ARROW);
  });

  document.getElementById("line-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "drawing-tool", "line-tool");
    store.setShapeSelectedToDraw(LINE);
  });

  document.getElementById("pencil-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "drawing-tool", "pencil-tool");
    store.setShapeSelectedToDraw(PENCIL);
  });

  document.getElementById("text-tool").addEventListener("click", () => {
    switchActiveTool(canvas, "drawing-tool", "text-tool");
    store.setShapeSelectedToDraw(TEXT);
  });

  document.getElementById("undo-tool").addEventListener("click", undo);
  document.getElementById("redo-tool").addEventListener("click", redo);
};

// REFACTOR THIS FILE
