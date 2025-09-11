import { AddShapeCommand } from "../commands/add-shape.js";
import { CommandManager } from "../commands/command-manager.js";
import { ARROW, CIRCLE, LINE, FREEHAND, RECTANGLE } from "../constants.js";
import {
  computeStartingCoordinatesForDrawing,
  drawArrow,
  drawCircle,
  drawLine,
  drawFreehand,
  drawRectangle,
} from "../shapes/draw.js";
import { Freehand } from "../shapes/freehand.js";
import { store } from "../store.js";

const manager = new CommandManager();
let shapeBeingDrawn = null;

export class Drawing {
  static redrawCanvas = (canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    store.shapes.forEach((shape) => shape.draw(ctx));
  };

  static beginDrawing = () => {
    if (store.getControls().isCursorAtDrawingStartPoint) {
      computeStartingCoordinatesForDrawing();
      store.setIsCursorAtDrawingStartPoint(false);
    }
  };

  static drawShape = (canvas) => {
    const ctx = canvas.getContext("2d");
    switch (store.getShapeSelectedToDraw()) {
      case RECTANGLE:
        shapeBeingDrawn = drawRectangle();
        break;
      case CIRCLE:
        shapeBeingDrawn = drawCircle();
        break;

      case LINE:
        shapeBeingDrawn = drawLine();
        break;

      case ARROW:
        shapeBeingDrawn = drawArrow();
        break;

      case FREEHAND:
        shapeBeingDrawn = drawFreehand();
        break;

      default:
        console.log("Unknown shape");
    }

    Drawing.redrawCanvas(canvas);
    if (shapeBeingDrawn) shapeBeingDrawn.draw(ctx);
  };

  static endDrawing = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    store.setIsCursorAtDrawingStartPoint(true);
    if (store.getShapeSelectedToDraw() === FREEHAND) {
      shapeBeingDrawn = new Freehand(ctx);
    }

    if (shapeBeingDrawn) {
      manager.executeCommand(new AddShapeCommand(store, shapeBeingDrawn));
    }
  };
}
