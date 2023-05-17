import { BaseValidation } from './baseValidations';

export class PostProjectKeyValidation extends BaseValidation {
  strategies = {
    apiKey: 'required,string,blank',
  };
}
