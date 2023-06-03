export type FormValidator = (value: string) => string | boolean;

function selectRule(rule: string, message: string): FormValidator | never {
  switch (rule) {
    case 'required':
      return isRequired(message);
    case 'min':
      return isMinimum(message);
    case 'url':
      return isURLPath(message);
    default:
      throw new Error('Invalid rule passed.');
  }
}

export function runValidations(schema: {
  [key: string]: FormValidator | string;
}) {
  return function (value: string): string | boolean {
    let error: string | undefined;

    Object.keys(schema).forEach((key) => {
      if (!error) {
        let result;

        /**
         * Temporarily ignoring this due to TS
         * unable to detect if / else conditions.
         */
        if (typeof schema[key] === 'function') {
          // @ts-ignore
          result = schema[key](value);
        } else {
          // @ts-ignore
          result = selectRule(key, schema[key])(value);
        }

        if (typeof result === 'string') {
          error = result;
        }
      }
    });

    return error || true;
  };
}

export function isMinimum(message: string, min = 0) {
  return function (value: string) {
    if (value === undefined || Number(value) <= min) {
      return message;
    }

    return true;
  };
}

export function isRequired(message: string) {
  return function (value: string) {
    if (value === undefined || value.trim() === '') {
      return message;
    }

    return true;
  };
}

export function isURLPath(message: string) {
  return function (value: string) {
    let noError = true;

    // TODO: Let's clean this up :)
    '`~!@#$%^&*()_+={}[];"\'\\|<,>.?/'.split('').forEach((char) => {
      if (value.includes(char)) {
        noError = false;
      }
    });

    return noError || message;
  };
}
