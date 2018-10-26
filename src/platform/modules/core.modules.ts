import {MainComponent} from '../main/main-biz/main.component';
import {BusiTabComponent} from '..//main/main-biz/busi-tab.component';
import {PageNotFoundComponent} from '..//main/login/page-not-found.component';
import {WelcomeComponent} from '..//main/welcome/welcome.component';
import {AppMenuComponent} from '..//layout/menu/app-menu.component';
import {AppTopbarComponent} from '..//layout/topbar/app-topbar.component';
import {CodeNamePipe} from '..//pipe/codename/codename_pipe';
import {NuiSelectComponent} from '..//tag/nui/nui-select/nui-select.component';
import {NuiDateComponent} from '..//tag/nui/nui-date/nui-date.component';
import {NuiBizTabViewComponent} from '..//tag/nui/nui-tabview/nui-biz-tabview.component';
import {NuiMultiSelectComponent} from '..//tag/nui/nui-multi-select/nui-multi-select.component';

import {NumDatePipe} from '..//pipe/numdate/numdate_pipe';
import {NuiBlockUIComponent} from '..//tag/nui/nui-blockui/nui-blockui.component';
import {NuiMainMenu, NuiMainMenuSub} from '..//tag/nui/nui-main-menu/nui-main-menu.component';
import {NumberFormatPipe} from '..//pipe/numberformat/numberformat_pipe';

import {LoginService} from '..//main/login/login.service';
import {CodeNameService} from '..//service/codename/codename.service';
import {ValidatorMessageService} from '..//tag/nui/form-control/validator/validator-message.service';
import {CommonUtilService} from '..//tag/nui/form-control/validator/common-util.service';
import {MenuService} from '..//main/menu/menu.service';
import {HttpService} from '..//http/http.service';
import {CustomFormBuilder} from '..//tag/nui/form-control/custom-form-builder';
import {DialogService} from '..//dialog/dialog.service';
import {SystemSetting} from '..//system-setting/system-setting';
import {StorageService} from '..//storage/storage.service';
import {DivisionCodeService} from '..//service/division-code/division-code.service';
import {ReportService} from '..//report/report.service';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  ButtonModule, GrowlModule, InputTextModule, MessagesModule, PanelModule, SharedModule,
  TabViewModule
} from 'primeng/primeng';
import {CommonModule} from '@angular/common';
import {NuiPasswordModule} from '../tag/primeng/password/password';
import {NuiTooltipModule} from '../tag/primeng/tooltip/tooltip';
import {LoginComponent} from '../main/login/login.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ModuleLoaderService} from "../main/login/module-loader.service";
import {ChangePasswordComponent} from "../sys/change-password/change-password.component";
import {NuiDialogModule} from "../tag/primeng/dialog/dialog";
import {EnvConfigService} from "../system-setting/env-config.service";
import {LoginUseCASComponent} from "../main/login/login-use-cas.component";
import {ResetPasswordComponent} from "../sys/reset-password/reset-password.component";
import {SmartbiComponent} from "../main/smartbi/smartbi.component";
import {SmartbiConfigService} from "../main/smartbi/smartbi-config.service";

@NgModule({
  // 自定义的组件必须在这里声明
  declarations: [
    LoginComponent, PageNotFoundComponent, MainComponent, BusiTabComponent,
    PageNotFoundComponent, WelcomeComponent, AppMenuComponent, AppTopbarComponent,
    NuiBizTabViewComponent, NuiBlockUIComponent, NuiMainMenu, NuiMainMenuSub,
    ChangePasswordComponent, LoginUseCASComponent, ResetPasswordComponent, SmartbiComponent
  ],
  // 动态创建的组件必须在这里定义
  entryComponents: [
    WelcomeComponent, ChangePasswordComponent, SmartbiComponent
  ],
  // 引用的组件
  imports: [
    BrowserModule, HttpModule, BrowserAnimationsModule, FormsModule,
    ReactiveFormsModule, ButtonModule, MessagesModule, InputTextModule,
    SharedModule, CommonModule, GrowlModule, PanelModule, TabViewModule,
    NuiTooltipModule, NuiPasswordModule, NuiDialogModule
  ],
  exports: [
    NuiBlockUIComponent
  ],
  providers: [
    LoginService, CodeNameService, ValidatorMessageService,
    CommonUtilService, MenuService, HttpService, CustomFormBuilder,
    DialogService, SystemSetting, StorageService, DivisionCodeService,
    ReportService, ModuleLoaderService, EnvConfigService, SmartbiConfigService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule {
}
