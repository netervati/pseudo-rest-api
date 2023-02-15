import BaseError from './baseError';

export default class NotAuthenticatedError extends BaseError {
  statusCode = 401;
  statusMessage = '';

  constructor(message = 'User is not authenticated.') {
    super(message);
    this.statusMessage = message;
  }
}
