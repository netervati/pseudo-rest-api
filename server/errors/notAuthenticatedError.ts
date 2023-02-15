export default class NotAuthenticatedError extends Error implements APIError {
  statusCode = 401;
  statusMessage = '';

  constructor(message = 'User is not authenticated.') {
    super(message);
    this.statusMessage = message;
  }
}
