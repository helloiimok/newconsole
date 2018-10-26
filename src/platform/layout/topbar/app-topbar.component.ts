import {Component, Input, OnInit, Inject, forwardRef, ViewChild} from '@angular/core';
import {MainComponent} from '../../main/main-biz/main.component';
import {LoginService} from '../../main/login/login.service';
import {MenuItem} from 'primeng/primeng';
import {DialogService} from "../../dialog/dialog.service";

@Component({
  selector: 'app-topbar',
  template: `
    <div class="topbar " >
      <div class="topbar-left">
        <div class="logoimg"></div>
      </div>
      <div class="topbar-right">
        <div style="float:left;">
          <div id="menu-button" (click)="onMenuToggle()" >
            <i class="fa fa-angle-left"></i>
          </div>
        </div>
        <div class="titlebar-lb"></div>
        <!--<h2>全国扶贫开发信息系统业务管理子系统<span class="title-word">V</span><span>2.0</span></h2>-->
        <div class="toolbar">
          <ul>
            <!--<li class="toolconsoleicon"><a href="javascript:void(0)"></a></li>-->
            <li class=""><a href="javascript:void(0)"></a></li>
            <li class="toolpasswordicon"><a href="javascript:void(0)" (click)="openChangePwd(true)"></a></li>
            <!--<li class="toolsiteicon"><a href="javascript:void(0)"></a></li>-->
            <li class="toolouticon"><a href="javascript:void(0)" (click)="loginService.logout()"></a></li>
            <li class=""><a href="javascript:void(0)"></a></li>
            
          </ul>
        </div>
        <div class="toolbartext">欢迎访问本系统<span>【{{userName}}】</span>部门 <span>【{{orgName}}】</span></div>
      </div>
      <div id="topbar-menu-button" class="topbar-menu-button ">
        <p-slideMenu #topbarmenu [model]="items" [popup]="true"></p-slideMenu>
        <button #btn type="button" pButton icon="fa fa-bars" (click)="topbarmenu.toggle($event)"></button>
      </div>
    </div>
  `
})
export class AppTopbarComponent implements OnInit {

  @Input() reset: boolean;
  public userName: string;
  public orgName: string;
  items: MenuItem[];

  constructor(@Inject(forwardRef(() => MainComponent)) public main: MainComponent,
              public loginService: LoginService,
              private dialogService: DialogService) {}

  ngOnInit() {
    this.userName = this.loginService.getUserName();
    this.orgName = this.loginService.getOrgName();

    this.items = [
      {
        label: '控制中心',
        icon: 'fa-university',
        // items: [{
        //   label: 'New',
        //   icon: 'fa-plus',
        //   items: [
        //     {label: 'Project'},
        //     {label: 'Other'},
        //   ]
        // },
        //   {label: 'Open'},
        //   {label: 'Quit'}
        // ]
      },
      {
        label: '修改密码',
        icon: 'fa-edit',
        // items: [
        //   {label: 'Undo', icon: 'fa-mail-forward'},
        //   {label: 'Redo', icon: 'fa-mail-reply'}
        // ]
      },
      {
        label: '帮助',
        icon: 'fa-question-circle-o',
      },
      {
        label: '个人中心',
        icon: 'fa-user-circle',
      },
      {
        label: '退出',
        icon: 'fa-sign-out',
      }
    ];

    if (this.loginService.getIsDefPwd()) {
      let callBack = (()=> {
        this.openChangePwd(false);
      });
      let cancelCallBack = (()=> {
        this.dialogService.warning('当前密码为初始密码,必须修改密码后才可以使用系统',
          ()=>{
            this.loginService.logout();
          }, ()=>{
            this.openChangePwd(false);
          },
          '退出系统', '继续修改密码');
      });
      this.dialogService.warning('当前密码为初始密码,请修改密码', callBack, cancelCallBack, '修改密码', '取消');
    }
  }

  changeTheme(theme: string) {

  }

  onMenuToggle() {
    // 左侧菜单展开收起

    this.main.staticMenuDesktopInactive = !this.main.staticMenuDesktopInactive;

    // this.main.staticMenuMobileActive = !this.main.staticMenuMobileActive;
  }

  onMenuShow() {

    this.main.topbarItemsVisible = !this.main.topbarItemsVisible;
  }

  openChangePwd(isShowClose: boolean) {
    this.main.openChangePwd(isShowClose);
  }
}
