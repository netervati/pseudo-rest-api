import { BaseValidation } from './baseValidations';

export class PostApiValidation extends BaseValidation {
  strategies = {
    description: 'string',
    urlPath: 'required,string,blank',
  };
}

export class PutApiValidation extends BaseValidation {
  strategies = {
    description: 'string',
    urlPath: 'string,blank',
  };
}
