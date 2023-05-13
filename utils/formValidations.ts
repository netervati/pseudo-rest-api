export type FormValidator = (value: string) => string | boolean;

export function runValidations(schema: { [key: string]: FormValidator }) {
  return function (value: string) {
    let error: string | undefined;

    Object.keys(schema).forEach((key) => {
      if (!error) {
        const result = schema[key](value);

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
