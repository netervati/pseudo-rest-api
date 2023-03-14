import isBlank from './isBlank';
import isNone from './isNone';
import isNotArray from './isNotArray';
import isNotNumber from './isNotNumber';
import isNotObject from './isNotObject';
import isNotString from './isNotString';
import { ValidationValue } from './types';

const VALIDATION_RULES: {
  [key: string]: {
    message: string;
    validate: (value: ValidationValue) => boolean;
  };
} = {
  array: {
    message: '* is not an array.',
    validate: isNotArray,
  },
  blank: {
    message: '* is an empty string.',
    validate: isBlank,
  },
  number: {
    message: '* is not a number',
    validate: isNotNumber,
  },
  object: {
    message: '* is not an object.',
    validate: isNotObject,
  },
  required: {
    message: '* is not passed.',
    validate: isNone,
  },
  string: {
    message: '* is not a string',
    validate: isNotString,
  },
};

type ValidationResult = null | string;

export function validateByRules(
  validations: string,
  value: ValidationValue
): ValidationResult {
  const validationRules = validations.split(',');
  let withError = null;

  validationRules.forEach((rule) => {
    const validation = VALIDATION_RULES[rule];

    if (validation.validate(value)) {
      withError = validation.message;
    }
  });

  return withError;
}
