
/**
 * Created by jins on 2017/4/10.
 */
import {PipeTransform, Pipe} from "@angular/core";
import {CodeNameService} from "../../service/codename/codename.service";
import {CodeName} from "../../service/codename/codename";

@Pipe({
  name: 'codename',
  pure:true
})
export class CodeNamePipe implements PipeTransform {

  codeNameList:  { [key:string]:CodeName[]} = {};

  codeList: CodeName[];
  constructor(private codeNameService: CodeNameService){

  }

  transform(paramValue: any, codeType: string, codeList: CodeName[]): string{
    if(codeType == null || codeType == ''){
      this.codeList = codeList;
    } else {
      this.codeList = this.codeNameList[codeType];
      if(!this.codeList){
        this.codeList = this.codeNameService.getCodename(codeType);
        this.codeNameList[codeType] = this.codeList;
      }
    }

    let value: string;
    if(paramValue == null){
      return '';
    } else {
      value = String(paramValue);
    }
    // if(codeType){
      // debugger;
      if(this.codeList && this.codeList.length > 0){
        let result: string = '';  //返回值
        let values = value.split(',');  //拆分逗号分隔的多个参数
        for(let temp of values){
          if(temp == ''){
            continue;
          }
          let flag: boolean = true; //是否查询到对应的label值
          for(let code of this.codeList){
            if(code.value == temp){
              if(result == ''){
                result += code.label;
                flag = false;
                break;
              }else{
                result += ',' + code.label;
                flag = false;
                break;
              }
            }
          }
          //如果没查到对应的label值
          if(flag){
            if(result == ''){
              result += temp;
            }else{
              result += ',' + temp;
            }
          }
        }
        return result;
      }
    // }
    return value;
  }
}
