
import {Injectable} from "@angular/core";
import {SystemSetting} from "../system-setting/system-setting";
import {CodeName} from "../service/codename/codename";

declare var localStorage: any;
declare var sessionStorage: any;

@Injectable()
export class StorageService {

  private keyPrefix: string = 'cpad_';

  constructor(
    public sysSetting: SystemSetting
  ) {}

  private setLocal(key: string, content:Object) {
    localStorage.setItem(this.keyPrefix + key, content);
  }

  private getLocal(key: string): any{
    return localStorage[this.keyPrefix + key]
  }
  private setSession(key: string, content:Object) {
    sessionStorage.setItem(this.keyPrefix + key, content);
  }

  private getSession(key: string): any{
    return sessionStorage.getItem(this.keyPrefix + key);
  }

  private removeSession(key: string): any{
    return sessionStorage.removeItem(this.keyPrefix + key);
  }

  public getToken(): any{
    return this.getSession(this.sysSetting.KEY_TOKEN);
  }

  public setToken(token: any){
    // console.log('setToken='+ token);
    this.setSession(this.sysSetting.KEY_TOKEN, token);
  }

  /**
   * 取得二级代码更新日期
   * @returns {any}
   */
  public getCodeNameUpdateDate(): number{
    const token = this.getLocal(this.sysSetting.KEY_CODENAME_UPDATE_DATE);
    return token? Number(token): 0;
}

  public setCodeNameUpdateDate(date: number){
    this.setLocal(this.sysSetting.KEY_CODENAME_UPDATE_DATE, date? date: 0);
  }

  public getCodeName(): {[key:string]: CodeName[]}{
    const codeNameStr = this.getLocal(this.sysSetting.KEY_CODENAME);
    return codeNameStr? JSON.parse(codeNameStr): {};
  }

  public setCodeName(codeNameList: {[key:string]:CodeName[]}){
    this.setLocal(this.sysSetting.KEY_CODENAME, JSON.stringify(codeNameList? codeNameList: {}));
  }
}
