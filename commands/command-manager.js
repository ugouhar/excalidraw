export class CommandManager {
  constructor() {
    this.history = [];
  }

  executeCommand = (command) => {
    command.execute();
    this.history.push(command);
  };

  undo() {
    if (this.history.length === 0) return;
    const lastCommand = this.history.pop();
    if (lastCommand) {
      lastCommand.undo();
    }
  }
}
