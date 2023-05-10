import { BaseValidation } from './baseValidations';

export class PostApiValidation extends BaseValidation {
  strategies = {
    description: 'string',
    resourceModelId: 'required,string,blank',
    urlPath: 'required,string,blank',
  };
}

export class PutApiValidation extends BaseValidation {
  strategies = {
    description: 'string',
    resourceModelId: 'string,blank',
    urlPath: 'string,blank',
  };
}
