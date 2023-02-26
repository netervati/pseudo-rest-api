import type { H3Event } from 'h3';
import get from 'lodash/get';
import { NotAuthenticatedError } from '../errors';

export function authValidation(event: H3Event): ValidationResult {
  if (get(event, 'context.auth.user', null) === null) {
    return new NotAuthenticatedError().serialize();
  }
}
