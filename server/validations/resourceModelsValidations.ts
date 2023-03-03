import { BaseValidation } from './baseValidations';

export class PostResourceModelValidation extends BaseValidation {
  strategies = {
    name: 'required,string,blank',
    structure: {
      rules: 'required,array',
      array: {
        default: 'required,string',
        name: 'required,string,blank',
        type: 'required,string,blank',
      },
    },
  };
}
