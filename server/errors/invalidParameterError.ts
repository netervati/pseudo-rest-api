import BaseError from './baseError';

export default class InvalidParameterError extends BaseError {
  statusCode = 400;
  statusMessage = '';

  constructor(parameter: string) {
    const message = `${parameter} has an invalid value.`;

    super(message);
    this.statusMessage = message;
  }
}
