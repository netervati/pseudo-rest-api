export default class InvalidParameterError extends Error implements APIError {
  statusCode = 400;
  statusMessage = '';

  constructor(parameter: string) {
    const message = `${parameter} has an invalid value.`;

    super(message);
    this.statusMessage = message;
  }
}
