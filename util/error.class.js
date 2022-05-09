class HttpError {
  // eslint-disable-next-line space-before-function-paren
  constructor(message, status) {
    this.httpStatus = status;
    this.message = message;
  }
}
module.exports = { HttpError };
