import {Component, Input, OnInit} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/primeng';
import {AppComponent} from './app.component';
import {GridCrduComponent} from './sungkdemo/view/grid-crdu/grid-crdu.component';
import {MainConsoleComponent} from './main/main-console.component';
import {TeammenuComponent} from './console/teammenu/teammenu.component';
import {LoginService} from '../platform/main/login/login.service';
import {TeamauthoritydistComponent} from './console/teamauthoritydist/teamauthoritydist.component';
import {DialogService} from '../platform/dialog/dialog.service';
import {TeamauthoritygroupComponent} from './console/teamauthoritygroup/teamauthoritygroup.component';
import {SystemSetting} from '../platform/system-setting/system-setting';

@Component({
  selector: 'app-menu',
  template: `
    <ul app-submenu [item]="model" root="true" class="layout-menu clearfix" [reset]="reset" visible="true"></ul>
  `
})
export class AppMenuComponent implements OnInit {

  @Input() reset: boolean;

  model: MenuItem[];

  constructor(public app: MainConsoleComponent,
              private loginService: LoginService,
              private  dialogService: DialogService,
              private  sys: SystemSetting) {
  }

  ngOnInit() {
    debugger;
    // if(this.loginService.getUserAccount().match("^99[0-9]{0}admin")){
    //   this.model = [
    //     {
    //       label: '菜单管理', icon: 'fa fa-fw fa-sitemap',
    //       items: [
    //         {label: '菜单管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/MenumanageComponent']},
    //         {label: '用户管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/UsermanageComponent']},
    //         {label: '角色管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/RolemanageComponent']},
    //         {label: '省管理控制台授权', icon: 'fa fa-fw fa-columns', routerLink: ['/main/GrantMenuToProvNewComponent']},
    //         {label: '批量授权', icon: 'fa fa-fw fa-columns', routerLink: ['/main/ProvbathComponent']},
    //       ];
    // }
    if ((this.loginService.getUserAccount() === 'fpbadmin' || this.loginService.getUserAccount().indexOf('admin') >= 0)
    // && this.sys.isOldConsole
    ) {
      if (this.sys.isOldConsole) {
        if (this.loginService.getUserAccount() === 'fpbadmin') {
          this.model = [
            {
              label: '菜单管理', icon: 'fa fa-fw fa-sitemap',
              items: [
                {label: '菜单管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/MenumanageComponent']},
                {label: '用户管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/UsermanageComponent']},
                {label: '角色管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/RolemanageComponent']},
                {label: '省管理控制台授权', icon: 'fa fa-fw fa-columns', routerLink: ['/main/GrantMenuToProvNewComponent']},
                {label: '批量授权', icon: 'fa fa-fw fa-columns', routerLink: ['/main/ProvbathComponent']},
              ]
            },
          ];
        } else {
          this.model = [
            {
              label: '菜单管理', icon: 'fa fa-fw fa-sitemap',
              items: [
                {label: '菜单管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/MenumanageComponent']},
                {label: '用户管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/UsermanageComponent']},
                {label: '角色管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/RolemanageComponent']},
                // {label: '省管理控制台授权', icon: 'fa fa-fw fa-columns', routerLink: ['/main/GrantMenuToProvNewComponent']},
                {label: '批量授权', icon: 'fa fa-fw fa-columns', routerLink: ['/main/ProvbathComponent']},
              ]
            },
          ];
        }


      } else {
        // fpbadmin 考核评估司登录
        if (this.loginService.getUserAccount() === 'fpbadmin') {
          this.model = [
            {
              label: '考核评估司', icon: 'fa fa-fw fa-sitemap',
              items: [
                {label: '菜单管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/MenumanageComponent']},
                {
                  label: '用户角色管理',
                  icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeamrolemanageComponent', '{"type":"khpgs"}']
                },
                {
                  label: '省授权管理', icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeamauthorityComponent']
                },
                // {label: '工作队授权管理',icon: 'fa fa-fw fa-columns',routerLink: ['/main/TeamauthoritydistComponent'],},
                // {label: '工作组授权管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/TeamauthoritygroupComponent']},
                {
                  label: '工作组授权菜单', icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeammenuComponent', '{"level":"0,1"}']
                },
                {
                  label: '工作队授权菜单', icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeammenuComponent', '{"level":"2"}']
                },
                {
                  label: '片区授权菜单', icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeammenuComponent', '{"level":"3"}']
                },
                {
                  label: '省授权菜单', icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeammenuComponent', '{"level":"4"}']
                },
                {
                  label: '国办授权菜单', icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeammenuComponent', '{"level":"9"}']
                },
                {
                  label: '测试', icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/Teammenu2Component', '{"level":"4"}']
                },
              ]
            },
            // 20180720 jins 新控制台集成SmartBI 添加测试菜单
            // 通过参数中的Key作为唯一ID在SmartbiConfigService中查找具体配置项
            // 也可以将SmartbiConfigService中的配置内容转为数据库表结构的方式定义
            {
              label: '统计分析', icon: 'fa fa-fw fa-sitemap',
              items: [
                {
                  label: '测试0709',
                  icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/smartbi', '{"type":"khpgs", "key": "test0709"}']
                },
                {
                  label: '2018个人基本信息',
                  icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/smartbi', '{"type":"khpgs", "key": "2018PersonBasicInfo"}']
                }
              ]
            }
          ];
        }
        if (this.loginService.getUserAccount() === 'ddjc_fpbadmin') {

          this.model = [
            {label: '菜单管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/MenumanageComponent']},
            {
              label: '用户角色管理',
              icon: 'fa fa-fw fa-columns',
              routerLink: ['/main/TeamrolemanageComponent', '{"type":"ddjc"}']
            },
            {
              label: '国扶办角色授权菜单', icon: 'fa fa-fw fa-columns',
              routerLink: ['/main/Teammenu2Component', '{"level":"d00"}'],
            },
            {
              label: '编辑公司角色授权菜单', icon: 'fa fa-fw fa-columns',
              routerLink: ['/main/Teammenu2Component', '{"level":"d10"}'],
            },
            {
              label: '省角色授权菜单', icon: 'fa fa-fw fa-columns',
              routerLink: ['/main/Teammenu2Component', '{"level":"d20"}'],
            },
            {
              label: '市角色授权菜单', icon: 'fa fa-fw fa-columns',
              routerLink: ['/main/Teammenu2Component', '{"level":"d40"}'],
            },
            {
              label: '县角色授权菜单', icon: 'fa fa-fw fa-columns',
              routerLink: ['/main/Teammenu2Component', '{"level":"d50"}'],
            },
            {
              label: '乡角色授权菜单', icon: 'fa fa-fw fa-columns',
              routerLink: ['/main/Teammenu2Component', '{"level":"d60"}'],
            },
            {
              label: '村角色授权菜单', icon: 'fa fa-fw fa-columns',
              routerLink: ['/main/Teammenu2Component', '{"level":"d70"}'],
            }
          ];

        }
        // 省控制台
        if (this.loginService.getUserAccount().match('^[0-9]{2}admin') && this.loginService.getUserAccount() != '99admin') {
          debugger;
          this.model = [
            {
              label: '考核评估司', icon: 'fa fa-fw fa-sitemap',
              items: [
                {
                  label: '用户角色管理',
                  icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeamrolemanageComponent', '{ "label" : "test"} ']
                },
                {
                  label: '团区域授权管理', icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeamauthorityComponent']
                },
                // {
                //   label: '工作组授权菜单', icon: 'fa fa-fw fa-columns',
                //   routerLink: ['/main/TeammenuComponent']
                // },
              ]
            },
          ];
        }

        // 片区控制台菜单
        if (this.loginService.getUserAccount().match('^[0-9]{4}admin')) {
          this.model = [
            {
              label: '考核评估司', icon: 'fa fa-fw fa-sitemap',
              items: [
                {
                  label: '用户角色管理',
                  icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeamrolemanageComponent', '{"type":"khpgs"}'],
                },
                // {label: '片区授权管理', icon: 'fa fa-fw fa-columns',routerLink: ['/main/TeamauthorityComponent']},
                {label: '工作队区域授权管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/TeamauthoritydistComponent'], },
                // {label: '工作组授权菜单', icon: 'fa fa-fw fa-columns', routerLink: ['/main/TeamauthoritygroupComponent']},
                // {label: '工作组授权菜单', icon: 'fa fa-fw fa-columns', routerLink: ['/main/TeammenuComponent']},
              ]
            },
          ];
        }

        // 片区控制台菜单
        if (this.loginService.getUserAccount().match('^[0-9]{6}admin')) {
          this.model = [
            {
              label: '考核评估司', icon: 'fa fa-fw fa-sitemap',
              items: [
                {
                  label: '用户角色管理',
                  icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeamrolemanageComponent', '{"type":"khpgs"}'],
                },
                // {label: '片区授权管理', icon: 'fa fa-fw fa-columns',routerLink: ['/main/TeamauthorityComponent']},
                // {label: '工作组区域授权管理', icon: 'fa fa-fw fa-columns', routerLink: ['/main/TeamauthoritydistComponent'], },
                {label: '工作组授权菜单', icon: 'fa fa-fw fa-columns', routerLink: ['/main/TeamauthoritygroupComponent']},
                // {label: '工作组授权菜单', icon: 'fa fa-fw fa-columns', routerLink: ['/main/TeammenuComponent']},
              ]
            },
          ];
        }
        // 对控制台菜单
        if (this.loginService.getUserAccount().match('^[0-9]{8}admin')) {
          this.model = [
            {
              label: '考核评估司', icon: 'fa fa-fw fa-sitemap',
              items: [
                {
                  label: '用户角色管理', icon: 'fa fa-fw fa-columns',
                  routerLink: ['/main/TeamrolemanageComponent', '{"label":"test"}']
                },
                // {label: '片区授权管理', icon: 'fa fa-fw fa-columns',routerLink: ['/main/TeamauthorityComponent']},
                // {label: '工作队授权管理',icon: 'fa fa-fw fa-columns',routerLink: ['/main/TeamauthoritydistComponent'],},
                {label: '工作组授权菜单', icon: 'fa fa-fw fa-columns', routerLink: ['/main/TeamauthoritygroupComponent']},
                // {label: '工作组授权菜单', icon: 'fa fa-fw fa-columns', routerLink: ['/main/TeammenuComponent']},
              ]
            },
          ];
        }
      }


    }

  }

  changeTheme(theme) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('theme-css');
    const layoutLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('layout-css');

    themeLink.href = 'assets/theme/theme-' + theme + '.css';
    layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
  }
}

@Component({
  /* tslint:disable:component-selector */
  selector: '[app-submenu]',
  /* tslint:enable:component-selector */
  template: `
    <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
      <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass"
          *ngIf="child.visible === false ? false : true">
        <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" *ngIf="!child.routerLink"
           [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
          <i [ngClass]="child.icon"></i>
          <span>{{child.label}}</span>
          <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
          <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
        </a>

        <a (click)="itemClick($event,child,i)" *ngIf="child.routerLink" [attr.target]="child.target"
           [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
           [routerLinkActiveOptions]="{exact: true}">
          <i [ngClass]="child.icon"></i>
          <span>{{child.label}}</span>
          <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
          <i class="fa fa-fw fa-angle-down" *ngIf="child.items"></i>
        </a>
        <ul app-submenu [item]="child" *ngIf="child.items" [@children]="isActive(i) ?
                'visible' : 'hidden'" [visible]="isActive(i)" [reset]="reset"></ul>
      </li>
    </ng-template>
  `,
  animations: [
    trigger('children', [
      state('hidden', style({
        height: '0px'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class AppSubMenuComponent {

  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  _reset: boolean;

  activeIndex: number;

  constructor(public app: MainConsoleComponent, public router: Router, public location: Location) {
  }

  itemClick(event: Event, item: MenuItem, index: number) {
    // avoid processing disabled items
    debugger;
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // activate current item and deactivate active sibling if any
    this.activeIndex = (this.activeIndex === index) ? null : index;

    // execute command
    if (item.command) {
      item.command({originalEvent: event, item: item});
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      if (this.app.isHorizontal()) {
        this.app.resetMenu = true;
      } else {
        this.app.resetMenu = false;
      }

      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input() get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset && this.app.isHorizontal()) {
      this.activeIndex = null;
    }
  }
}
