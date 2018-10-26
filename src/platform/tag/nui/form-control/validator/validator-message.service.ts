/**
 * Created by jins on 2017/3/15.
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

/**
 * 错误信息需要的参数
 */
export class ValidateMessageParam{
  label?: string;
  minlength?: number;
  maxlength?: number;

  constructor() { }

}

/**
 * 根据校验规则以及参数，获得校验失败后的错误信息
 */
@Injectable()
export class ValidatorMessageService {

  constructor() { }

  getValidatorMessage(key: string, param?: ValidateMessageParam): String{

    const defaultError = "该项目的" + key + "验证未通过。";

    // 如果没传入参数的话，则报默认错误。
    try {
      // 错误消息，所有校验类错误信息都从这里取得
      const validatorMessages = {
        'required' : `${param.label}是必填项。`,
        'minLength': `${param.label}的最小长度应该大于等于${param.minlength}。`,
        'maxLength': `${param.label}的最大长度应该小于等于${param.maxlength}。`,
        'number'   : `${param.label}只能录入数字。`,
      };

      const messages = validatorMessages[key];
      // 正常取得Message，参数也都匹配成功，就返回
      if(messages){
        return messages;
      }

    } catch (e) {
      console.log(e instanceof EvalError); // true
      console.log(e.message);              // some Message
      console.log(e.name);
    }
    return defaultError;
  }
}

