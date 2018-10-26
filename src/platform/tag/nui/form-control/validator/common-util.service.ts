import {CustomFormControl} from "../custom-form-control";
import {CodeNameService} from "../../../../service/codename/codename.service";
import {Message} from "primeng/components/common/api";
import {FormGroup} from "@angular/forms";
import {ValidatorMessageService} from "./validator-message.service";
import {Injectable, Output} from "@angular/core";

/**
 * Created by jins on 2017/3/29.
 */

@Injectable()
export class CommonUtilService {

  // form校验的错误信息
  msgs: Message[];

  // 保存每次校验后的错误信息
  formErrors = {};


  /**
   * 初始化各种控件和Service
   * @param codeNameService
   * @param mainService
   * @param fb
   * @param validatorMessageService
   */
  constructor(private codeNameService: CodeNameService,
              private validatorMessageService: ValidatorMessageService) {

  }

  /**
   * 值变化时就进行校验，然后弹出校验信息。
   * 公共方法，稍后提到公共JS文件中。
   * @param data
   */
  onValueChanged(formGroup: FormGroup, data?: any) {
    this.msgs = [];
    if (!formGroup) {
      return;
    }
    const form = formGroup;

    // for ... in ... 循环的是key， 用for...of...循环的是值
    for (const field in formGroup.controls) {
      // console.log('=======================================');
      // console.log(key);
      // console.log(this.searchCondForm.controls[key]);
      // debugger;
      this.formErrors[field] = '';
      const control = formGroup.controls[field];
      if (control && control.dirty && !control.valid) {
        for (const errorKey in control.errors) {
          if (control instanceof CustomFormControl) {
            let customControl: CustomFormControl = control;
            this.formErrors[field] += this.validatorMessageService.getValidatorMessage(errorKey, customControl.getMessageParam()) + ' ';
          } else {
            this.formErrors[field] += this.validatorMessageService.getValidatorMessage(errorKey) + ' ';
          }
          // this.formErrors[field] += this.validatorMessageService.getValidatorMessage(key) + ' ';
        }
        this.msgs.push({severity: 'error', summary: '错误信息', detail: this.formErrors[field]});
      }

    }
  }

  getMsgs(): Message[] {
    return this.msgs;
  }

  getFormErrors(): {} {
    return this.formErrors;
  }
}
