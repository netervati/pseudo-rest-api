import isEmpty from 'lodash/isEmpty';

type AnyValue = string | boolean | number;

const VALIDATION_RULES: { [key: string]: (value: AnyValue) => boolean } = {
  blank: (value) => {
    if (typeof value !== 'string') {
      return false;
    }

    return value.trim() === '';
  },
  required: (value) => isEmpty(value),
  string: (value) => {
    if (value === null || value === undefined) {
      return false;
    }

    return typeof value !== 'string';
  },
};

export function validateByRules(validations: string, value: AnyValue) {
  const validationRules = validations.split(',');
  let withError = false;

  validationRules.forEach((rule) => {
    if (VALIDATION_RULES[rule](value)) {
      withError = true;
    }
  });

  return withError;
}
