function ParseError(errorCode, errorArgs) {
  Error.call(this);
  this.message = `invalid parsed value [${errorArgs.value}]`;
}
export default ParseError;

ParseError.prototype = Object.create(Error.prototype);
