import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Message} from "primeng/primeng";
import {Validators} from "@angular/forms";
import {LoginService} from "../../main/login/login.service";
import {CustomFormGroup} from "../../tag/nui/form-control/custom-form-group";
import {DialogService} from "../../dialog/dialog.service";
import {CustomFormBuilder} from "../../tag/nui/form-control/custom-form-builder";
import {CommonUtilService} from "../../tag/nui/form-control/validator/common-util.service";
import {CustomFormControl} from "../../tag/nui/form-control/custom-form-control";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: []
})

export class ChangePasswordComponent implements AfterViewInit, OnInit {

  changePwdForm: CustomFormGroup;

  // 保存每次校验后的错误信息
  msgs:Message[];
  formErrors: any = {};
  showChangePwd: boolean;
  isShowClose: boolean = true;

  constructor( private fb: CustomFormBuilder,
               private dialogService: DialogService,
               private commonUtil: CommonUtilService,
               private loginService: LoginService) {
    this.buildForm();

  }
  ngOnInit() {
    this.showChangePwd = false;
  }
  ngAfterViewInit(): void {
  }

  //初始化form
  buildForm() {
    this.changePwdForm = this.fb.group({
      'password': new CustomFormControl('', Validators.required, {label: '当前密码'}),
      'newpassword': new CustomFormControl('', Validators.required, {label: '新密码'}),
      'confirmnewpassword': new CustomFormControl('', Validators.required, {label: '确认新密码'}),
    });
    // debugger;
    this.changePwdForm.valueChanges.subscribe(data => {
      this.commonUtil.onValueChanged(this.changePwdForm, data);
      this.msgs = this.commonUtil.getMsgs();
      this.formErrors = this.commonUtil.getFormErrors();
    });
    this.commonUtil.onValueChanged(this.changePwdForm);
  }
  open(isShowClose: boolean) {
    // debugger;
    this.resetForm();
    this.isShowClose = isShowClose;
    this.showChangePwd = true;
  }

  close() {
    this.resetForm();
    this.showChangePwd = false;
  }

  resetForm() {
    this.isShowClose = true;
    this.changePwdForm.reset();
  }

  changePwd() {
    var userInfo = this.changePwdForm.getRawValue();
    if (!userInfo) {
      this.dialogService.error('请录入账号信息');
      return;
    }
    if (!userInfo.password || userInfo.password == '') {
      this.dialogService.error('请录入当前密码');
      return;
    }
    if (!userInfo.newpassword || userInfo.newpassword == '') {
      this.dialogService.error('请录入新密码');
      return;
    }
    if (!userInfo.confirmnewpassword || userInfo.confirmnewpassword == '') {
      this.dialogService.error('请录入确认密码');
      return;
    }

    if (userInfo.newpassword != userInfo.confirmnewpassword) {
      this.dialogService.error('新密码两次录入的不一致');
      return;
    }

    if (userInfo.password == userInfo.newpassword) {
      this.dialogService.error('您输入的新密码与当前密码相同');
      return;
    }

    let callBack = (()=> {
      // debugger;
      // 成功回调
      let successFunc = (response => {

        if (response.options.code != 1) {
          this.dialogService.error(response.options.errorMsg);
          return;
        }
        this.dialogService.success('密码修改成功,请重新登录', ()=>{
          this.close();
          this.loginService.logout();
        });

      });
      this.loginService.changePassword(this.loginService.getUserAccount(), userInfo.password, userInfo.newpassword, successFunc);
    });
    this.dialogService.question('是否要修改密码?', callBack, null, '是', '否');
  }
}
