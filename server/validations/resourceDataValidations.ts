import { BaseValidation } from './baseValidations';

export class PostResourceDataValidation extends BaseValidation {
  strategies = {
    count: 'required,number',
  };
}
