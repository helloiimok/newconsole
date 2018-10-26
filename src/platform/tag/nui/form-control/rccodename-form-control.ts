/**
 * Created by 张宏喜 on 2017/7/18.
 */
import {FormControl, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {ValidateMessageParam} from "./validator/validator-message.service";
import {CustomFormControl} from "./custom-form-control";
import * as moment from 'moment'
import {SystemSetting} from "../../../system-setting/system-setting";

//类型枚举(radio or check)
export enum RadioOrCheck { RADIO = 1, CHECK = 2} ;

export class RCCodeNameFormControl extends FormControl{
  // 错误信息需要的参数
  validatorMessageParam: any;
  type: RadioOrCheck;

  constructor(formState?: any,
              type?: RadioOrCheck,
              validator?: ValidatorFn | ValidatorFn[],
              validatorMessageParam?: ValidateMessageParam,
              asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]

  ){
    // 如果初类型为RadioOrCheck.CHECK，则转换为字符数组
    if(type == RadioOrCheck.CHECK){
      if(formState){
        super(formState.split(','), validator, asyncValidator);
      }else{
        super([], validator, asyncValidator);
      }
    } else {
      super(formState, validator, asyncValidator);
    }

    if(type){
      this.type = type;
    } else {
      this.type = RadioOrCheck.RADIO
    }
    this.validatorMessageParam = validatorMessageParam;
  }

  getMessageParam(): ValidateMessageParam{
    return this.validatorMessageParam;
  }

  getType(): RadioOrCheck{
    return this.type;
  }

}

