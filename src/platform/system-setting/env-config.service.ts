
import {Injectable} from "@angular/core";
import {SystemSetting} from "./system-setting";
import {EnvConfigData} from "./env-config";

@Injectable()
export class EnvConfigService {

  private config: EnvConfig = EnvConfigData;

  private isUseProdConfig(): boolean {
    if(this.config.env.isUseProdUrlConfig == true){
      return true;
    }
    return false;
  }
  /**
   * 返回访问后台的URL
   * @returns {any}
   */
  public getBaseHref(): UrlInfo{
    let result = new UrlInfo();
    // 默认返回当前域名
    const location = window.location.origin;
    const href = window.location.href;
    const paths = window.location.pathname.split('/');
    let context = "";
    for(let path of paths){
      if(path.length > 0){
        context = path;
        break;
      }
    }

    result.baseHref = location + "/" + context + "/api";
    result.reportHref = location + "/" + context +"/api";
    // 初始化后台访问URL,如果开发环境使用指定URL
    if(!this.isUseProdConfig()){
      result.baseHref = SystemSetting.baseURL;
      result.reportHref = SystemSetting.baseURL;
      // 如果不使用指定URL，则根据配置列表进行匹配，
    } else {
      if(this.config.backendList){
        for(let param of this.config.backendList){
          if(href.indexOf(param.local) == 0){
            result.baseHref = param.defaultBackend;
            result.reportHref = param.reportBackend;
            break;
          }
        }
      }
    }
    return result;
  }

}

export class UrlInfo{
  baseHref: string;
  reportHref: string;

  constructor(){
  }
}

export declare class EnvConfig{
  env: {isUseProdUrlConfig: boolean}
  backendList: [
    {
      local: string,
      defaultBackend: string,
      reportBackend: string;
      details?: [
        {key: string, value: string}
      ]
    }
  ]
}
