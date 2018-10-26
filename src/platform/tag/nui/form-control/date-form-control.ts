/**
 * Created by jins on 2017/4/12.
 */
import {FormControl, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {ValidateMessageParam} from "./validator/validator-message.service";
import {CustomFormControl} from "./custom-form-control";
import * as moment from 'moment'
import {SystemSetting} from "../../../system-setting/system-setting";

export class DateFormControl extends FormControl{
  // 错误信息需要的参数
  validatorMessageParam: any;
  dataFormat: string;

  constructor(formState?: any,
              dataFormat?: string,
              validator?: ValidatorFn | ValidatorFn[],
              validatorMessageParam?: ValidateMessageParam,
              asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]

  ){
    // 如果初始值为number类型，则转换为日期类型
    if(formState && (typeof formState === 'number')){
      super(moment("" + formState, dataFormat? dataFormat: SystemSetting.defaultDateFormat).toDate(), validator, asyncValidator);
    } else {
      super(formState, validator, asyncValidator);
    }

    if(dataFormat){
      this.dataFormat = dataFormat;
    } else {
      this.dataFormat = SystemSetting.defaultDateFormat // FOR moment.js
    }
    this.validatorMessageParam = validatorMessageParam;
  }

  getMessageParam(): ValidateMessageParam{
    return this.validatorMessageParam;
  }

  getDataFormat(): string{
    return this.dataFormat;
  }

}

