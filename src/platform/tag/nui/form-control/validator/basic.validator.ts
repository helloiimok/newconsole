
/**
 * Validator that requires controls to have a value of a maximum length.
 */
import {AbstractControl, ValidatorFn} from "@angular/forms";


export class CpadValidators {

  /**
   * 添加number类型的Validator
   * @param maxLength
   * @returns {(control:AbstractControl)=>{[p: string]: any}}
   */
  static maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let length = 0;
      if(typeof control.value === 'string' || typeof control.value === 'number'){
        length = String(control.value).length;
      }
      // const length = typeof control.value === 'string' ? control.value.length : 0;
      return length > maxLength ?
        {'maxLength': {'requiredLength': maxLength, 'actualLength': length}} :
        null;
    };
  }

  /**
   * 添加number类型的Validator
   * @param minLength
   * @returns {(control:AbstractControl)=>{[p: string]: any}}
   */
  static minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let length = 0;
      if(typeof control.value === 'string' || typeof control.value === 'number'){
        length = String(control.value).length;
      }
      // const length = typeof control.value === 'string' ? control.value.length : 0;
      return length < minLength ?
        {'minLength': {'requiredLength': minLength, 'actualLength': length}} :
        null;
    };
  }
}
