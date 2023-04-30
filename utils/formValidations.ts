export function isRequired(message: string) {
  return function (value: string | undefined) {
    if (value === undefined || value.trim() === '') {
      return message;
    }

    return true;
  };
}
