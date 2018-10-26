/**
 * Created by jins on 2017/3/15.
 */
import {FormControl, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {ValidateMessageParam} from "./validator/validator-message.service";

export class CustomFormControl extends FormControl{
  // 错误信息需要的参数
  validatorMessageParam: any;

  constructor(formState?: any,
              validator?: ValidatorFn | ValidatorFn[],
              validatorMessageParam?: ValidateMessageParam,
              asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]

  ){
    super(formState, validator, asyncValidator);
    this.validatorMessageParam = validatorMessageParam;
  }

  getMessageParam(): ValidateMessageParam{
    return this.validatorMessageParam;
  }

}
