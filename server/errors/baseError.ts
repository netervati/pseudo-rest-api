export default class BaseError extends Error implements APIError {
  statusCode = 200;
  statusMessage = '';
}
