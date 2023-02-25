import { InvalidParameterError } from '../errors';
import { validateByRules } from './helpers';

type StructureRules = {
  [key: string]: {
    type: string;
  };
};

type BodyParams = { [key: string]: StructureRules };

export function postResourceModelValidation({
  structure,
}: BodyParams): Result<never, APIError> {
  for (const [key, value] of Object.entries(structure)) {
    if (validateByRules('required,object', value)) {
      return new InvalidParameterError(key);
    }

    if (validateByRules('required,string', value.type)) {
      return new InvalidParameterError(`type of ${key}`);
    }
  }
}
