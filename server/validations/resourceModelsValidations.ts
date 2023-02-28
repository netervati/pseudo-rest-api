import { NuxtError } from 'nuxt/dist/app/composables';
import { validateByRules } from './helpers';

type StructureRules = {
  [key: string]: {
    type: string;
  };
};

type BodyParams = { [key: string]: StructureRules };

function formatError(message: string, key: string): NuxtError {
  return createError({
    statusCode: HTTP_STATUS_BAD_REQUEST,
    statusMessage: message.replace('*', key),
  });
}

// TODO: Revisit and follow new validation format.
export function postResourceModelValidation({
  structure,
}: BodyParams): undefined | ValidationResult {
  for (const [key, value] of Object.entries(structure)) {
    let error = validateByRules('required,object', value);

    if (error) {
      return formatError(error, key);
    }

    error = validateByRules('required,string', value.type);

    if (error) {
      return formatError(error, `type of ${key}`);
    }
  }
}
