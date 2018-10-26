/**
 * Created by 张宏喜 on 2017/7/28.
 */

import {PipeTransform, Pipe} from "@angular/core";

@Pipe({
  name: 'numberFormat',
  pure:true
})

export class NumberFormatPipe implements PipeTransform {

  transform(value: any, formatType: string): string{
    // debugger;
    if(!value){
      return  ''; //value 为空时返回空串
    }
    if(formatType){
      return formatType.replace('[money]', String(value));
    }else{
      return value;
    }
  }
}
