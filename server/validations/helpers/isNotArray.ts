import isNone from './isNone';
import { ValidationValue } from './types';

/**
 * Checks if value is not an array. Ignores "none"
 * value.
 *
 * @param value
 * @returns
 */
export default function (value: ValidationValue): boolean {
  if (isNone(value)) {
    return false;
  }

  return !Array.isArray(value);
}
