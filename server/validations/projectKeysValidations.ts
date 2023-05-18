import { BaseValidation } from './baseValidations';

export class PostProjectKeyValidation extends BaseValidation {
  strategies = {
    projectApiKey: 'required,string,blank',
  };
}
