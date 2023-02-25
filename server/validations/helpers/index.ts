import isBlank from './isBlank';
import isNone from './isNone';
import isNotArray from './isNotArray';
import isNotString from './isNotString';
import { ValidationValue } from './types';

const VALIDATION_RULES: {
  [key: string]: (value: ValidationValue) => boolean;
} = {
  array: isNotArray,
  blank: isBlank,
  required: isNone,
  string: isNotString,
};

export function validateByRules(validations: string, value: ValidationValue) {
  const validationRules = validations.split(',');
  let withError = false;

  validationRules.forEach((rule) => {
    if (VALIDATION_RULES[rule](value)) {
      withError = true;
    }
  });

  return withError;
}
