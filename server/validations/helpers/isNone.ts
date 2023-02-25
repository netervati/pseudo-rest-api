import { ValidationValue } from './types';

/**
 * Checks if value is null or undefined.
 *
 * @param value
 * @returns
 */
export default function (value: ValidationValue): boolean {
  return value === null || value === undefined;
}
