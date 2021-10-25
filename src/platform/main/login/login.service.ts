import {Injectable} from '@angular/core';
import {CustomParam, HttpService} from '../../http/http.service';
import {DialogService} from '../../dialog/dialog.service';
import {Router} from '@angular/router';

import * as CryptoJS from 'crypto-js';
import {MenuService} from '../menu/menu.service';
import {LoginForm} from './login.component';
import {CodeNameService} from '../../service/codename/codename.service';
import {SystemSetting} from '../../system-setting/system-setting';
import {DivisionCodeService} from '../../service/division-code/division-code.service';

@Injectable()
export class LoginService {

  private isLogin = false;
  private keyWord = 'hvalzJBBKp3TxR5v';

  private loginInfo: UserInfo;
  private resetPasswordURL = 'security/resetPassword';
  private changePasswordURL = 'security/changePassword';
  private isDefPwd = false;

  constructor(private httpService: HttpService,
              private dialogService: DialogService,
              private router: Router,
              private menuService: MenuService,
              private codeNameService: CodeNameService,
              public sys: SystemSetting,
              private divisionService: DivisionCodeService) {
  }

  /**
   * 登陆处理
   * @param loginForm
   */
  login(loginForm: LoginForm, validateToken: string, createValidateCode: any) {
    const loginInfo: LoginDTO = {
      account: this.encrypt(loginForm.account),
      password: this.encrypt(loginForm.password),
      // loginBean: null,
      // loginMethod: null,
      inputCode: loginForm.inputCode,
      validateToken: validateToken
    };

    const successFunc = (
      response => {
        this.loginInfo = response.operateInfo;
        // 记录当前登陆用户的上层行政区划以及向下一层行政区划列表，供行政区划控件使用
        this.divisionService.initUserUnitInfo(response.orgCodeList, this.getOrgLevel());
        this.isLogin = true;
        this.isDefPwd = response.isDefPwd;
        // 初始化菜单
        // this.menuService.initMenuMap(response.menu);
        // Load二级代码
        this.codeNameService.loadCodeName();
        this.router.navigate(['/main']);
        // this.router.navigate(['/loadBiz']);

      }
    );

    const errorFunc = (
      response => {
        if (response.options.code == 250) {
          this.dialogService.error(response.options.errorMsg, createValidateCode(validateToken));
        } else {
          this.dialogService.error(response.options.errorMsg);
        }
      }
    );

    //   正常的控制台使用这个方法（consoleLogin）
    if (this.sys.isOldConsole) {
      this.httpService.doLogin('security/consoleLogin', loginInfo, successFunc, errorFunc);
    } else {
      this.httpService.doLogin('security/loginForMobilePcConsole', loginInfo, successFunc, errorFunc);
    }

    // 移动端控制台使用下面的方法 loginForMobilePcConsole
    //
  }

  /**
   * 登陆处理
   * @param loginForm
   */
  loginUseCAS() {
    const loginInfo: LoginDTO = {
      account: null,
      password: null,
      loginBean: null,
      loginMethod: null,
      inputCode: null,
      validateToken: null
    };

    const successFunc = (
      response => {
        this.loginInfo = response.operateInfo;
        // 记录当前登陆用户的上层行政区划以及向下一层行政区划列表，供行政区划控件使用
        this.divisionService.initUserUnitInfo(response.orgCodeList, this.getOrgLevel());
        this.isLogin = true;
        this.isDefPwd = response.isDefPwd;
        // 初始化菜单
        this.menuService.initMenuMap(response.menu);
        // Load二级代码
        this.codeNameService.loadCodeName();
        this.router.navigate(['/main']);
        // this.router.navigate(['/loadBiz']);
      }
    );

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );

    this.httpService.doLogin('security/loginUseCAS', loginInfo, successFunc, errorFunc);
  }


  doGetValidateToken(successFunc: any) {

    this.httpService.doPost('security/getValidateToken', null, successFunc, true);
  }

  logout() {
    this.isLogin = false;
    const successFunc = (
      response => {
        // 清理菜单信息
        this.reset();
        this.menuService.reset();
        this.divisionService.reset();
        this.router.navigate(['/']);
      }
    );
    const param = new CustomParam();
    param.options = {OPT: 'logout'};
    this.httpService.doPost('security/logout', param, successFunc, true);
  }

  reset() {
    this.loginInfo = null;
  }

  isLoggon() {
    return this.isLoggon;
  }

  resetPassword(account: string, successFunc: any): void {
    const data = {
      options: {opt: 'resetPassword'},
      account: this.encrypt(account)
    };

    this.httpService.doPost(this.resetPasswordURL, data, successFunc);
  }

  changePassword(account: string, password: string, newPassword: string, successFunc: any): void {
    const data = {
      options: {opt: 'updatePassword'},
      account: this.encrypt(account),
      password: this.encrypt(password),
      newPassword: this.encrypt(newPassword)
    };

    this.httpService.doPost(this.changePasswordURL, data, successFunc);
  }

  /**
   * 加密算法
   *
   * @param word
   * @returns {string}
   */
  private encrypt(word): string {

    const key = CryptoJS.enc.Latin1.parse(this.keyWord);
    const iv = CryptoJS.enc.Latin1.parse(this.keyWord);

    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});

    return encrypted.toString();
  }

  // /**
  //  * 解密算法
  //  * @param word
  //  * @returns {string}
  //  */
  // private decrypt(word){
  //   //var encryptedHexStr = CryptoJS.enc.Utf8.parse(word);
  //   //var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  //   const key = CryptoJS.enc.Latin1.parse(this.keyWord);
  //   const iv  = CryptoJS.enc.Latin1.parse(this.keyWord);
  //
  //   const decrypt = CryptoJS.AES.decrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
  //   const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  //   return decryptedStr.toString();
  // }

  checkLogin() {
    // 检查是否已经登陆，如果没有登陆则退出到登陆页面
    if (!this.isLogin) {
      // this.dialogService.error('请先登录！', (
      //   ()=> this.logout()
      // ));
      this.logout();
    }
  }

  /**
   * 取得登陆用户相关信息
   */
  getUserAccount(): string {
    return this.loginInfo ? this.loginInfo.useraccount : '';
  }

  getUnitCode(): string {
    return this.loginInfo ? this.loginInfo.orgcode : '';
  }

  getUserName(): string {
    return this.loginInfo ? this.loginInfo.username : '';
  }

  getOrgName(): string {
    return this.loginInfo ? this.loginInfo.orgname : '';
  }

  getOrgLevel(): string {
    return this.loginInfo ? this.loginInfo.orgleve : '';
  }

  getIsDefPwd(): boolean {
    return this.isDefPwd;
  }
}

export declare class LoginDTO {
  account: string;
  password: string;
  inputCode: string;
  validateToken: string;
  loginBean?: string;
  loginMethod?: string;
}

export declare class UserInfo {
  username: string;
  useraccount: string;
  orgleve: string;
  orgcode: string;
  orgname: string;
  operateorgcode: string;
}
