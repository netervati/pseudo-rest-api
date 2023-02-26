import { BaseValidation } from './baseValidations';

export class PostProjectValidation extends BaseValidation {
  strategies = {
    description: 'string',
    name: 'required,string,blank',
  };
}
