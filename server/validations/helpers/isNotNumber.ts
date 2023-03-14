import isNone from './isNone';
import { ValidationValue } from './types';

/**
 * Checks if value is not a number.
 *
 * @param value
 * @returns
 */
export default function (value: ValidationValue): boolean {
  if (isNone(value)) {
    return true;
  }

  return typeof value !== 'number';
}
