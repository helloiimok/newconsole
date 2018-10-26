import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoginService} from './login.service';
import {Message} from "primeng/components/common/api";
import {CustomFormGroup} from "../../tag/nui/form-control/custom-form-group";
import {Validators} from "@angular/forms";
import {CustomFormControl} from "../../tag/nui/form-control/custom-form-control";
import {CustomFormBuilder} from "../../tag/nui/form-control/custom-form-builder";
import {CommonUtilService} from "../../tag/nui/form-control/validator/common-util.service";
import {SystemSetting} from "../../system-setting/system-setting";
import {ModuleLoaderService} from "./module-loader.service";
import {DialogService} from '../../dialog/dialog.service';
import {HttpService} from "../../http/http.service";

declare var document: any;
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styles: []
})

export class LoginComponent implements AfterViewInit {
  loginForm: CustomFormGroup;
  validateToken: string;

  @ViewChild('account' )
  public accountInputRef: ElementRef;
  @ViewChild('password' )
  public passwordInputRef: ElementRef;
  @ViewChild('inputCode' )
  public inputCodeInputRef: ElementRef;

  // 保存每次校验后的错误信息
  msgs:Message[];
  formErrors :any = {};
  _height: string;

  constructor(private loginService: LoginService,
              private commonUtil: CommonUtilService,
              private fb: CustomFormBuilder,
              public sys: SystemSetting,
              private httpService: HttpService,
              private dialogService: DialogService,
              private loader: ModuleLoaderService) {
    this.buildLoginForm();
  }

  buildLoginForm(): void {
    this.loginForm = this.fb.group({
      'account': new CustomFormControl('', Validators.required, {label: '用户名'}),
      'password': new CustomFormControl('', Validators.required, {label: '密码'}),
      'inputCode': new CustomFormControl('', Validators.required, {label: '验证码'}),
    });

    // 每次ValueChange进行值得校验，并提示错误信息
    this.loginForm.valueChanges.subscribe(data => {
      this.commonUtil.onValueChanged(this.loginForm, data);
      this.msgs = this.commonUtil.getMsgs();
      this.formErrors = this.commonUtil.getFormErrors();
    });
    this.commonUtil.onValueChanged(this.loginForm);
  }

  /**
   * 登陆处理
   */
  login(){
    debugger;
    let loginForm = this.loginForm.getRawValue();
    this.loginService.login(loginForm, this.validateToken, this.createValidateCode);
  }

  // 设置主页面右侧纵滚
  ngAfterViewInit() {
    let heightNum = document.documentElement.clientHeight;
    let widthNum = document.documentElement.clientWidth;
    let panelTop=(heightNum-585)/5*3;
    document.getElementById("login-panel").style.marginTop=panelTop+"px";
    document.getElementById("login-title").style.marginTop=panelTop/3+"px";
    if(widthNum < 1920){
      document.getElementById("login-title").style.marginTop=0+"px";
    }

    // 设置焦点
    this.accountInputRef.nativeElement.focus();
    this.createValidateCode();

    // 开始加载其他Module
    this.loader.lazyLoadStart();
  }

  createValidateCode(validateToken?: string) {
    if (!validateToken) {
      validateToken = this.validateToken;
    }
    if (validateToken) {
      // 不使用固定常量，使用httpService初始化后的url
      // document.getElementById('inputImage').src = SystemSetting.baseURL + '/security/getValidateCode/' + validateToken + '?' + new Date().getTime();
      document.getElementById('inputImage').src = this.httpService.getBaseUrl() + '/security/getValidateCode/' + validateToken + '?' + new Date().getTime();
      // this.loginService.doGetValidateCode(this.validateToken);
    } else {
      let successFunc = (
        response => {
			try {
				let rs = response.json();
				if (rs.options && rs.options.code && rs.options.code != 1) {
					this.dialogService.error(rs.options.errorMsg);
					return;
				}
			} catch (e) {
				this.validateToken = response._body;
        // 不使用固定常量，使用httpService初始化后的url
				// document.getElementById('inputImage').src = SystemSetting.baseURL + '/security/getValidateCode/' + this.validateToken + '?' + new Date().getTime();
        document.getElementById('inputImage').src = this.httpService.getBaseUrl() + '/security/getValidateCode/' + this.validateToken + '?' + new Date().getTime();
			}

          // this.loginService.doGetValidateCode(this.validateToken);
        }

      );

      this.loginService.doGetValidateToken(successFunc);
    }

  }

  keyPress($event, id: string){
    if($event.key && $event.key === 'Enter'){
      if('account' == id) {
        this.passwordInputRef.nativeElement.focus();
      } else if('password' == id){
        this.inputCodeInputRef.nativeElement.focus();
      } else if('inputCode' == id){
        if(this.loginForm.valid){
          this.login();
        }
      }
    }
  }
}

export declare class LoginForm{
  account: string;
  password: string;
  inputCode: string;// 验证码
}
