export class OperationWithoutSocketOpenError extends Error {
  constructor() {
    super("Cannot operate on socket that hasn't been connected");
    this.name = "OperationWithoutSocketOpenError";
  }
}
