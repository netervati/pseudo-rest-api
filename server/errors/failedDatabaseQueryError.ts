import BaseError from './baseError';

export default class FailedDatabaseQueryError extends BaseError {
  statusCode = 400;
  statusMessage = '';

  constructor(message: string) {
    super(message);
    this.statusMessage = message;
  }
}
