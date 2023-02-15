import { InvalidParameterError } from '../errors';
import { validateByRules } from './helpers';

type BodyParams = { [key: string]: string };

export function postProjectValidation({
  name,
  description,
}: BodyParams): Result<never, APIError> {
  if (validateByRules('required,string,blank', name)) {
    return new InvalidParameterError('name');
  }

  if (validateByRules('required,string,blank', description)) {
    return new InvalidParameterError('description');
  }
}
