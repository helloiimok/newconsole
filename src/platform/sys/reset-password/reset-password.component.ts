import {AfterViewInit, Component} from '@angular/core';
import {Validators} from "@angular/forms";
import {Message} from "primeng/primeng";
import {CommonUtilService} from "../../tag/nui/form-control/validator/common-util.service";
import {LoginService} from "../../main/login/login.service";
import {CustomFormBuilder} from "../../tag/nui/form-control/custom-form-builder";
import {CustomFormGroup} from "../../tag/nui/form-control/custom-form-group";
import {DialogService} from "../../dialog/dialog.service";
import {CustomFormControl} from "../../tag/nui/form-control/custom-form-control";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: []
})
export class ResetPasswordComponent implements AfterViewInit {

  private changePwdSuccessLogout = (()=> {
    this.loginService.logout();
  });
  ngAfterViewInit(): void {
  }

  resetPwdForm: CustomFormGroup;

  // 保存每次校验后的错误信息
  msgs:Message[];
  formErrors: any = {};

  constructor( private fb: CustomFormBuilder,
               private dialogService: DialogService,
               private commonUtil: CommonUtilService,
               private loginService: LoginService) {
    this.buildForm();

  }

  //初始化form
  buildForm() {
    this.resetPwdForm = this.fb.group({
      'account': new CustomFormControl('', Validators.required, {label: '账号'})
    });
    // debugger;
    this.resetPwdForm.valueChanges.subscribe(data => {
      this.commonUtil.onValueChanged(this.resetPwdForm, data);
      this.msgs = this.commonUtil.getMsgs();
      this.formErrors = this.commonUtil.getFormErrors();
    });
    this.commonUtil.onValueChanged(this.resetPwdForm);
  }

  private ruleCheck(account: string): boolean {
    // debugger;
    let isOk = false;
    let currentUserOrgCode = this.loginService.getUnitCode();
    let currentUserOrgLevel = this.loginService.getOrgLevel();
    if (!currentUserOrgLevel || currentUserOrgLevel == '') {
      isOk = true;
    } else {
      switch (Number(currentUserOrgLevel)) {
        case 0:
          isOk = true;
          break;
        case 20:
          isOk = this.isAllowReset(account, currentUserOrgCode, 2);
          break;
        case 40:
          isOk = this.isAllowReset(account, currentUserOrgCode, 4);
          break;
        case 50:
          isOk = this.isAllowReset(account, currentUserOrgCode, 6);
          break;
        case 60:
          isOk = this.isAllowReset(account, currentUserOrgCode, 9);
          break;
        case 70:
          isOk = false;
          break;
        default:
          isOk = false;
          break;
      }
    }

    return isOk;
  }

  private cutstr(code: string, len: number): string {
    return code.substr(0, len);
  }

  private isAllowReset(account: string, code: string, len: number): boolean {
    if (this.loginService.getUserAccount() == account) {
      return false;
    }
    let resetCode = this.cutstr(account, len);
    let currentCode = this.cutstr(code, len);
    let isAllow: boolean = false;
    if (resetCode == currentCode) {
      isAllow = true;
    }
    return isAllow;
  }


  resetPwd() {
    let userInfo = this.resetPwdForm.getRawValue();
    if (!userInfo) {
      this.dialogService.error('请录入账号');
      return;
    } else if (!userInfo.account || userInfo.account == '') {
      this.dialogService.error('请录入账号');
      return;
    }

    if (this.ruleCheck(userInfo.account)) {
      let callBack = (()=> {
        // 成功回调
        let successFunc = (response => {

          if (response.options.code != 1) {
            this.dialogService.error(response.options.errorMsg);
            return;
          }

          if (this.loginService.getUserAccount() == userInfo.account) {
            this.dialogService.success('密码已重置为初始密码,重置账号为当前登录账号,请重新登录', this.changePwdSuccessLogout);
          } else {
            this.dialogService.success('密码已重置为初始密码');
          }
          this.resetPwdForm.reset();
        });
        this.loginService.resetPassword(userInfo.account, successFunc);
      });
      this.dialogService.question('是否要重置账号为' + userInfo.account + '的密码?', callBack, null, '是', '否');
    } else {
      this.dialogService.error('只可以重置下级单位操作员的账号密码');
      return;
    }

  }
}
