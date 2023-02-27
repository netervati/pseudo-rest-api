import { validateByRules } from './helpers';
import { ValidationValue } from './helpers/types';

export type ValidationParameters = {
  [key: string]: ValidationValue;
};

export type ValidationStrategies = { [key: string]: string };

export class BaseValidation {
  parameters;
  strategies: ValidationStrategies = {};

  constructor(parameters: ValidationParameters) {
    this.parameters = parameters;
  }

  validate(): ValidationResult {
    const errors = [];

    for (const [key, value] of Object.entries(this.strategies)) {
      const result = validateByRules(value, this.parameters[key]);

      if (typeof result === 'string') {
        errors.push({
          statusCode: HTTP_STATUS_BAD_REQUEST,
          statusMessage: result.replace('*', key),
        });
      }
    }

    if (errors.length > 0) {
      return serializeErrors(errors);
    }
  }
}
