export default class ParseError extends Error {
  constructor(errorCode, errorArgs) {
    super('Illegal parse object');

    this.errorCode = errorCode;
    this.errorArgs = errorArgs;
  }

  toString() {
    return `invalid parsed value [${this.errorArgs.value}]`;
  }
}
