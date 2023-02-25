import isNone from './isNone';
import { ValidationValue } from './types';

/**
 * Checks if value is not a string. Ignores "none"
 * value.
 *
 * @param value
 * @returns
 */
export default function (value: ValidationValue): boolean {
  if (isNone(value)) {
    return false;
  }

  return typeof value !== 'string';
}
