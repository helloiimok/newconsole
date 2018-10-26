import {Component} from '@angular/core';
import {MainConsoleComponent} from "./main/main-console.component";
import {LoginService} from "../platform/main/login/login.service";

@Component({
    selector: 'app-topbar',
    template: `
        <div class="topbar clearfix">
            <div class="topbar-left">
                <div class="logo">
                  <!--<img src="assets/layout/images/logo-black.png" alt="Logo">-->
                  <img src="assets/themeblue/images/logo-white.png" alt="Logo">
                </div>
            </div>

            <div class="topbar-right">
              <!--<a id="menu-button" href="#" (click)="app.onMenuButtonClick($event)">-->
              <!--<i class="fa fa-angle-left"></i>-->
              <!--</a>-->

                <a id="topbar-menu-button" href="#" (click)="app.onTopbarMenuButtonClick($event)">
                    <i class="fa fa-bars"></i>
                </a>
                <ul class="topbar-items fadeInDown animated" [ngClass]="{'topbar-items-visible': app.topbarMenuActive}">
                  <!--<li #profile class="profile-item" [ngClass]="{'active-top-menu':app.activeTopbarItem === profile}">-->
                  <!--<a href="#" (click)="app.onTopbarItemClick($event,profile)">-->
                  <!--<img class="profile-image" src="assets/layout/images/avatar.png">-->
                  <!--<span class="topbar-item-name">Jane Williams</span>-->
                  <!--</a>-->

                  <!--<ul class="poseidon-menu fadeInDown">-->
                  <!--&lt;!&ndash;<li role="menuitem">&ndash;&gt;-->
                  <!--&lt;!&ndash;<a href="#">&ndash;&gt;-->
                  <!--&lt;!&ndash;<i class="fa fa-fw fa-user"></i>&ndash;&gt;-->
                  <!--&lt;!&ndash;<span>Profile</span>&ndash;&gt;-->
                  <!--&lt;!&ndash;</a>&ndash;&gt;-->
                  <!--&lt;!&ndash;</li>&ndash;&gt;-->
                  <!--&lt;!&ndash;<li role="menuitem">&ndash;&gt;-->
                  <!--&lt;!&ndash;<a href="#">&ndash;&gt;-->
                  <!--&lt;!&ndash;<i class="fa fa-fw fa-user-secret"></i>&ndash;&gt;-->
                  <!--&lt;!&ndash;<span>Privacy</span>&ndash;&gt;-->
                  <!--&lt;!&ndash;</a>&ndash;&gt;-->
                  <!--&lt;!&ndash;</li>&ndash;&gt;-->
                  <!--&lt;!&ndash;<li role="menuitem">&ndash;&gt;-->
                  <!--&lt;!&ndash;<a href="#">&ndash;&gt;-->
                  <!--&lt;!&ndash;<i class="fa fa-fw fa-cog"></i>&ndash;&gt;-->
                  <!--&lt;!&ndash;<span>Settings</span>&ndash;&gt;-->
                  <!--&lt;!&ndash;</a>&ndash;&gt;-->
                  <!--&lt;!&ndash;</li>&ndash;&gt;-->
                  <!--<li role="menuitem">-->
                  <!--<a href="#">-->
                  <!--<i class="fa fa-fw fa-sign-out"></i>-->
                  <!--<span>退出</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--</ul>-->
                  <!--</li>-->
                    <li #settings [ngClass]="{'active-top-menu':app.activeTopbarItem === settings}">
                        <a href="#" (click)="app.onTopbarItemClick($event,settings)">
                            <i class="topbar-icon fa fa-fw fa-cog"></i>
                            <span class="topbar-item-name">Settings</span>
                        </a>
                        <ul class="poseidon-menu fadeInDown">
                            <li role="menuitem">
                              <a href="javascript: void(0)" (click)="loginService.logout()">
                                <i class="fa fa-fw fa-sign-out"></i>
                                <span>退出</span>
                              </a>
                            </li>
                        </ul>
                    </li>
                  <!--<li #messages [ngClass]="{'active-top-menu':app.activeTopbarItem === messages}">-->
                  <!--<a href="#" (click)="app.onTopbarItemClick($event,messages)">-->
                  <!--<i class="topbar-icon fa fa-fw fa-envelope-o"></i>-->
                  <!--<span class="topbar-badge animated rubberBand">5</span>-->
                  <!--<span class="topbar-item-name">Messages</span>-->
                  <!--</a>-->
                  <!--<ul class="poseidon-menu fadeInDown">-->
                  <!--<li role="menuitem">-->
                  <!--<a href="#" class="topbar-message">-->
                  <!--<img src="assets/layout/images/avatar1.png" width="35">-->
                  <!--<span>Give me a call</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--<li role="menuitem">-->
                  <!--<a href="#" class="topbar-message">-->
                  <!--<img src="assets/layout/images/avatar2.png" width="35">-->
                  <!--<span>Sales reports attached</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--<li role="menuitem">-->
                  <!--<a href="#" class="topbar-message">-->
                  <!--<img src="assets/layout/images/avatar3.png" width="35">-->
                  <!--<span>About your invoice</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--<li role="menuitem">-->
                  <!--<a href="#" class="topbar-message">-->
                  <!--<img src="assets/layout/images/avatar2.png" width="35">-->
                  <!--<span>Meeting today at 10pm</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--<li role="menuitem">-->
                  <!--<a href="#" class="topbar-message">-->
                  <!--<img src="assets/layout/images/avatar4.png" width="35">-->
                  <!--<span>Out of office</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--</ul>-->
                  <!--</li>-->
                  <!--<li #notifications [ngClass]="{'active-top-menu':app.activeTopbarItem === notifications}">-->
                  <!--<a href="#" (click)="app.onTopbarItemClick($event,notifications)">-->
                  <!--<i class="topbar-icon fa fa-fw fa-bell-o"></i>-->
                  <!--<span class="topbar-badge animated rubberBand">4</span>-->
                  <!--<span class="topbar-item-name">Notifications</span>-->
                  <!--</a>-->
                  <!--<ul class="poseidon-menu fadeInDown">-->
                  <!--<li role="menuitem">-->
                  <!--<a href="#">-->
                  <!--<i class="fa fa-fw fa-tasks"></i>-->
                  <!--<span>Pending tasks</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--<li role="menuitem">-->
                  <!--<a href="#">-->
                  <!--<i class="fa fa-fw fa-calendar-check-o"></i>-->
                  <!--<span>Meeting today at 3pm</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--<li role="menuitem">-->
                  <!--<a href="#">-->
                  <!--<i class="fa fa-fw fa-download"></i>-->
                  <!--<span>Download documents</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--<li role="menuitem">-->
                  <!--<a href="#">-->
                  <!--<i class="fa fa-fw fa-plane"></i>-->
                  <!--<span>Book flight</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--</ul>-->
                  <!--</li>-->

                </ul>
            </div>
          <div class="toolbartext">欢迎访问本系统<span>【{{loginService.getUserAccount()}}】</span>用户名
            <span>【{{loginService.getUserName()}}】</span>部门
            <span>【{{loginService.getOrgName()}}】</span></div>
        </div>
    `
})
export class AppTopBarComponent {

  constructor(public app: MainConsoleComponent,
              public loginService: LoginService) {
  }

}
