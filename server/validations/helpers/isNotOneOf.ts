import isNone from './isNone';
import { ValidationValue, ValidationDependencies } from './types';

/**
 * Checks if value matches one of set values.
 *
 * @param value
 * @param deps
 * @returns
 */
export default function (
  value: ValidationValue,
  deps: ValidationDependencies = {}
): boolean {
  if (isNone(value)) {
    return false;
  }

  if (!deps.set) {
    return false;
  }

  return !deps.set.includes(value);
}
