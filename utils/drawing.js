import { AddShapeCommand } from "../commands/add-shape.js";
import { CommandManager } from "../commands/command-manager.js";
import { ARROW, CIRCLE, LINE, RECTANGLE } from "../constants.js";
import {
  computeStartingCoordinatesForDrawing,
  drawArrow,
  drawCircle,
  drawLine,
  drawRectangle,
} from "../shapes/draw.js";
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

      default:
        console.log("Unknown shape");
    }

    Drawing.redrawCanvas(canvas);
    if (shapeBeingDrawn) shapeBeingDrawn.draw(ctx);
  };

  static endDrawing = () => {
    store.setIsCursorAtDrawingStartPoint(true);
    if (shapeBeingDrawn) {
      manager.executeCommand(new AddShapeCommand(store, shapeBeingDrawn));
    }
  };
}
