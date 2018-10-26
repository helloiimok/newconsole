/**
 * Created by 张宏喜 on 2017/6/7.
 */

import {PipeTransform, Pipe} from "@angular/core";
import * as moment from 'moment'
import {SystemSetting} from "../../system-setting/system-setting";

@Pipe({
  name: 'numdate',
  pure:true
})

export class NumDatePipe implements PipeTransform {

  transform(value: any, codeType: string): string{
    if(!value){
      return  ''; //value 为空时返回空串
    }
    let date:Date;
    if(value.toString().length == 4 ){
      date = moment(value.toString(),SystemSetting.defaultDateFormatWithYear).toDate();
    }else if(value.toString().length == 6){
      date = moment(value.toString(),SystemSetting.defaultDateFormatWithMonth).toDate();
    }else if(value.toString().length == 8 ){
      date = moment(value.toString(),SystemSetting.defaultDateFormat).toDate();
    }else if(value.toString().length == 14 ){
      date = moment(value.toString(),SystemSetting.defaultDateFormatWithTime).toDate();
    }else{
      return '传入日期长度不对';
    }
    if(codeType){
      return moment(date).format(codeType);
    }else{
      return value;
    }
  }
}
