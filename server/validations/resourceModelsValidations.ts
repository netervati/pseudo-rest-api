import { InvalidParameterError } from '../errors';
import { validateByRules } from './helpers';

type StructureRules = {
  [key: string]: {
    type: string;
  };
};

type BodyParams = { [key: string]: StructureRules };

// TODO: Revisit and follow new validation format.
export function postResourceModelValidation({
  structure,
}: BodyParams): undefined | ValidationResult {
  for (const [key, value] of Object.entries(structure)) {
    if (validateByRules('required,object', value)) {
      return new InvalidParameterError(key).serialize();
    }

    if (validateByRules('required,string', value.type)) {
      return new InvalidParameterError(`type of ${key}`).serialize();
    }
  }
}
