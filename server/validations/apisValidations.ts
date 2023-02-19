import { InvalidParameterError } from '../errors';
import { validateByRules } from './helpers';

type BodyParams = { [key: string]: string };

export function postApiValidation({
  urlPath,
  description,
}: BodyParams): Result<never, APIError> {
  if (validateByRules('required,string,blank', urlPath)) {
    return new InvalidParameterError('urlPath');
  }

  if (validateByRules('string', description)) {
    return new InvalidParameterError('description');
  }
}
