export class CommandManager {
  constructor() {
    if (CommandManager.instance) {
      return CommandManager.instance;
    }
    CommandManager.instance = this;
    this.undoStack = [];
    this.redoStack = [];
  }

  executeCommand = (command) => {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
  };

  undo() {
    if (this.undoStack.length === 0) return;
    const lastCommand = this.undoStack.pop();
    if (lastCommand) {
      lastCommand.undo();
      this.redoStack.push(lastCommand);
    }
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const lastCommand = this.redoStack.pop();
    if (lastCommand) {
      lastCommand.redo();
      this.undoStack.push(lastCommand);
    }
  }
}
