/**
 * Created by jins on 2017/4/19.
 */
import swal, { SweetAlertOptions } from 'sweetalert2';
import {Injectable} from "@angular/core";

@Injectable()
export class DialogService{

  // alert(message: string): void{
  //   swal({
  //     text: message,
  //     allowOutsideClick: false
  //   })
  // }

  success(message: string, callBack?: any, confirmButtonText?: string): void{
    swal({
      title: '',
      text: message,
      type: 'success',
      confirmButtonText: confirmButtonText? confirmButtonText: '确定',
      allowOutsideClick: false
    }).then(
      callBack
    );
  }

  error(message: string, callBack?: any, confirmButtonText?: string): void{
    swal({
      title: '',
      text: message,
      type: 'error',
      confirmButtonText: confirmButtonText? confirmButtonText: '确定',
      allowOutsideClick: false
    }).then(
      callBack
    );
  }

  info(message: string, callBack?: any, confirmButtonText?: string): void{
    swal({
      title: '',
      text: message,
      type: 'info',
      confirmButtonText: confirmButtonText? confirmButtonText: '确定',
      allowOutsideClick: false
    }).then(
      callBack
    );
  }

  question(message: string, callBack: any, cancelCallBack?: any, confirmButtonText?: string, cancelButtonText?: string): void{
    swal({
      title: '',
      text: message,
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText? confirmButtonText: '确定',
      cancelButtonText: cancelButtonText? cancelButtonText: '取消',
      allowOutsideClick: false
    }).then(result => {
        if (result.value) {
          if (callBack) {
            callBack();
          }
        } else if (result.dismiss) {
          if (cancelCallBack) {
            cancelCallBack();
          }
      }
      }
    ).catch(swal.noop)
  }

  warning(message: string, callBack: any, cancelCallBack?: any, confirmButtonText?: string, cancelButtonText?: string): void{
    swal({
      title: '',
      text: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText? confirmButtonText: '确定',
      cancelButtonText: cancelButtonText? cancelButtonText: '取消',
      allowOutsideClick: false
    }).then(result => {
      if (result.value) {
        if (callBack) {
          callBack();
        }
      } else if (result.dismiss) {
        if (cancelCallBack) {
          cancelCallBack();
        }
        }
      }
    ).catch(swal.noop)
  }
}
