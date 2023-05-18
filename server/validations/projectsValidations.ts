import { BaseValidation } from './baseValidations';

export class PostProjectValidation extends BaseValidation {
  strategies = {
    description: 'string',
    name: 'required,string,blank',
  };
}

export class PutProjectValidation extends BaseValidation {
  strategies = {
    name: 'required,string,blank',
    projectApiKey: 'required,string,blank',
  };
}
