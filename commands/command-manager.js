export class CommandManager {
  constructor() {
    this.history = [];
    this.redoStack = [];
  }

  executeCommand = (command) => {
    command.execute();
    this.history.push(command);
    this.redoStack = [];
  };

  undo() {
    if (this.history.length === 0) return;
    const lastCommand = this.history.pop();
    if (lastCommand) {
      lastCommand.undo();
      this.redoStack.push(lastCommand);
    }
  }

  redo() {
    const lastCommand = this.redoStack.pop();
    if (lastCommand) {
      lastCommand.execute();
      this.history.push(lastCommand);
    }
  }
}
