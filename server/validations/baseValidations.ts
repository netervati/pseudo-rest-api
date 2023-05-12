import { NuxtError } from 'nuxt/dist/app/composables';
import { validateByRules } from './helpers';
import { ValidationValue, ValidationDependencies } from './helpers/types';

export type ValidationParameters = {
  [key: string]: ValidationValue;
};

export type ValidationStrategies = {
  [key: string]:
    | string
    | {
        rules: string;
        array?: string | { [key: string]: string };
        set?: string[];
      };
};

export class BaseValidation {
  errors: SerializedError[] = [];
  parameters;
  strategies: ValidationStrategies = {};

  constructor(parameters: ValidationParameters) {
    this.parameters = parameters;
  }

  #serializeErrors(): NuxtError {
    const data: { statusMessage: string }[] = [];

    this.errors.forEach(({ statusMessage }) => {
      data.push({ statusMessage });
    });

    return createError({
      data,
      statusCode: HTTP_STATUS_BAD_REQUEST,
      statusMessage: 'Invalid parameter/s',
    });
  }

  #evaluate(
    key: string,
    params: ValidationParameters,
    rules: string,
    deps: ValidationDependencies = {}
  ) {
    const result = validateByRules(rules, params[key], deps);

    if (typeof result === 'string') {
      this.errors.push({
        statusCode: HTTP_STATUS_BAD_REQUEST,
        statusMessage: result.replace('*', key),
      });
    }
  }

  validate(): ValidationResult {
    for (const [key, value] of Object.entries(this.strategies)) {
      if (typeof value === 'string') {
        this.#evaluate(key, this.parameters, value);

        continue;
      }

      if (value.constructor !== Object) {
        continue;
      }

      const deps: ValidationDependencies = {};

      if (value.set) {
        deps.set = value.set;
      }

      this.#evaluate(key, this.parameters, value.rules, deps);

      if (
        value.array?.constructor !== Object ||
        !Array.isArray(this.parameters[key])
      ) {
        continue;
      }

      // @ts-ignore
      for (const el of this.parameters[key]) {
        for (const [keyB, valueB] of Object.entries(value.array)) {
          this.#evaluate(keyB, el, valueB);
        }
      }
    }

    if (this.errors.length > 0) {
      return this.#serializeErrors();
    }
  }
}
