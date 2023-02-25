import { ValidationValue } from './types';

/**
 * Checks if value is an empty string.
 *
 * @param value
 * @returns
 */
export default function (value: ValidationValue): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  return value.trim() === '';
}
