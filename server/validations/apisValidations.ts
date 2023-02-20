import { InvalidParameterError } from '../errors';
import { validateByRules } from './helpers';

type BodyParams = { [key: string]: string };

export function postApiValidation({
  description,
  urlPath,
}: BodyParams): Result<never, APIError> {
  if (validateByRules('string', description)) {
    return new InvalidParameterError('description');
  }

  if (validateByRules('required,string,blank', urlPath)) {
    return new InvalidParameterError('urlPath');
  }
}
