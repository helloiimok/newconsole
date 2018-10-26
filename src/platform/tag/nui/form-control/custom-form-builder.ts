
import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {CustomFormGroup} from "./custom-form-group";


/**
 * @whatItDoes Creates an {@link AbstractControl} from a user-specified configuration.
 *
 * It is essentially syntactic sugar that shortens the `new FormGroup()`,
 * `new FormControl()`, and `new FormArray()` boilerplate that can build up in larger
 * forms.
 *
 * @howToUse
 *
 * To use, inject `FormBuilder` into your component class. You can then call its methods
 * directly.
 *
 * {@example forms/ts/formBuilder/form_builder_example.ts region='Component'}
 *
 *  * **npm package**: `@angular/forms`
 *
 *  * **NgModule**: {@link ReactiveFormsModule}
 *
 * @stable
 */
@Injectable()
export class CustomFormBuilder {
  /**
   * Construct a new {@link FormGroup} with the given map of configuration.
   * Valid keys for the `extra` parameter map are `validator` and `asyncValidator`.
   *
   * See the {@link FormGroup} constructor for more details.
   */
  group(controlsConfig: {[key: string]: any}, extra: {[key: string]: any}|null = null): CustomFormGroup {
    const controls = this._reduceControls(controlsConfig);
    const validator: ValidatorFn = extra != null ? extra['validator'] : null;
    const asyncValidator: AsyncValidatorFn = extra != null ? extra['asyncValidator'] : null;
    return new CustomFormGroup(controls, validator, asyncValidator);
  }
  /**
   * Construct a new {@link FormControl} with the given `formState`,`validator`, and
   * `asyncValidator`.
   *
   * `formState` can either be a standalone value for the form control or an object
   * that contains both a value and a disabled status.
   *
   */
  control(
    formState: Object, validator?: ValidatorFn|ValidatorFn[]|null,
    asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): FormControl {
    return new FormControl(formState, validator, asyncValidator);
  }

  /**
   * Construct a {@link FormArray} from the given `controlsConfig` array of
   * configuration, with the given optional `validator` and `asyncValidator`.
   */
  array(
    controlsConfig: any[], validator?: ValidatorFn|null,
    asyncValidator?: AsyncValidatorFn|null): FormArray {
    const controls = controlsConfig.map(c => this._createControl(c));
    return new FormArray(controls, validator, asyncValidator);
  }

  /** @internal */
  _reduceControls(controlsConfig: {[k: string]: any}): {[key: string]: AbstractControl} {
    const controls: {[key: string]: AbstractControl} = {};
    Object.keys(controlsConfig).forEach(controlName => {
      controls[controlName] = this._createControl(controlsConfig[controlName]);
    });
    return controls;
  }

  /** @internal */
  _createControl(controlConfig: any): AbstractControl {
    if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup ||
      controlConfig instanceof FormArray) {
      return controlConfig;

    } else if (Array.isArray(controlConfig)) {
      const value = controlConfig[0];
      const validator: ValidatorFn = controlConfig.length > 1 ? controlConfig[1] : null;
      const asyncValidator: AsyncValidatorFn = controlConfig.length > 2 ? controlConfig[2] : null;
      return this.control(value, validator, asyncValidator);

    } else {
      return this.control(controlConfig);
    }
  }
}
