import { BaseValidation } from './baseValidations';

const httpMethods = ['DELETE', 'GET', 'POST', 'PUT'];

export class PostApiValidation extends BaseValidation {
  strategies = {
    description: 'string',
    method: {
      rules: 'required,oneOf',
      set: httpMethods,
    },
    resourceModelId: 'required,string,blank',
    urlPath: 'required,string,blank',
  };
}

export class PutApiValidation extends BaseValidation {
  strategies = {
    description: 'string',
    method: {
      rules: 'oneOf',
      set: httpMethods,
    },
    resourceModelId: 'string,blank',
    urlPath: 'string,blank',
  };
}
