import {ErrorHandler} from "@angular/core";
import swal, { SweetAlertOptions } from 'sweetalert2';

export class CpadErrorHandler implements ErrorHandler {

  handleError(error) {
    // do something with the exception
    // debugger;
    console.log(error);
    swal({
    title: '',
      text: '该页面发生异常，请刷新页面。',
      type: 'error',
      allowOutsideClick: false
  })
  // this.dialogService.error(, '');
  }
}
