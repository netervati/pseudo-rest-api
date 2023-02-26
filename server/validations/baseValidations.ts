import { ValidationError } from '../errors';
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

    for (const [key, value] of Object.entries(this.parameters)) {
      const result = validateByRules(this.strategies[key], value);

      if (typeof result === 'string') {
        errors.push(new ValidationError(result.replace('*', key)).serialize());
      }
    }

    if (errors.length > 0) {
      return serializeErrors(errors);
    }
  }
}
