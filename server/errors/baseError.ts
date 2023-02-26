export default class BaseError extends Error implements APIError {
  statusCode = 200;
  statusMessage = '';

  serialize() {
    return {
      statusCode: this.statusCode,
      statusMessage: this.statusMessage,
    };
  }
}
