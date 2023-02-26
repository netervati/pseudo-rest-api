import { BaseValidation } from './baseValidations';

export class PostApiValidation extends BaseValidation {
  strategies = {
    description: 'string',
    urlPath: 'required,string,blank',
  };
}
