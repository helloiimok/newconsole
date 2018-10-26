import {NgModule, SystemJsNgModuleLoader} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutes} from './app.routes';
import 'rxjs/add/operator/toPromise';

import {AccordionModule} from 'primeng/primeng';
import {AutoCompleteModule} from 'primeng/primeng';
import {BreadcrumbModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {CalendarModule} from 'primeng/primeng';
import {CarouselModule} from 'primeng/primeng';
import {ChartModule} from 'primeng/primeng';
import {ColorPickerModule} from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';
import {ChipsModule} from 'primeng/primeng';
import {CodeHighlighterModule} from 'primeng/primeng';
import {ConfirmDialogModule} from 'primeng/primeng';
import {SharedModule} from 'primeng/primeng';
import {ContextMenuModule} from 'primeng/primeng';
import {DataGridModule} from 'primeng/primeng';
import {DataListModule} from 'primeng/primeng';
import {DataScrollerModule} from 'primeng/primeng';
import {DataTableModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {DragDropModule} from 'primeng/primeng';
import {DropdownModule} from 'primeng/primeng';
import {EditorModule} from 'primeng/primeng';
import {FieldsetModule} from 'primeng/primeng';
import {FileUploadModule} from 'primeng/primeng';
import {GalleriaModule} from 'primeng/primeng';
import {GMapModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';
import {InputMaskModule} from 'primeng/primeng';
import {InputSwitchModule} from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';
import {InputTextareaModule} from 'primeng/primeng';
import {LightboxModule} from 'primeng/primeng';
import {ListboxModule} from 'primeng/primeng';
import {MegaMenuModule} from 'primeng/primeng';
import {MenuModule} from 'primeng/primeng';
import {MenubarModule} from 'primeng/primeng';
import {MessagesModule} from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/primeng';
import {OrderListModule} from 'primeng/primeng';
import {OrganizationChartModule} from 'primeng/primeng';
import {OverlayPanelModule} from 'primeng/primeng';
import {PaginatorModule} from 'primeng/primeng';
import {PanelModule} from 'primeng/primeng';
import {PanelMenuModule} from 'primeng/primeng';
import {PasswordModule} from 'primeng/primeng';
import {PickListModule} from 'primeng/primeng';
import {ProgressBarModule} from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/primeng';
import {RatingModule} from 'primeng/primeng';
import {ScheduleModule} from 'primeng/primeng';
import {SelectButtonModule} from 'primeng/primeng';
import {SlideMenuModule} from 'primeng/primeng';
import {SliderModule} from 'primeng/primeng';
import {SpinnerModule} from 'primeng/primeng';
import {SplitButtonModule} from 'primeng/primeng';
import {StepsModule} from 'primeng/primeng';
import {TabMenuModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/primeng';
import {TerminalModule} from 'primeng/primeng';
import {TieredMenuModule} from 'primeng/primeng';
import {ToggleButtonModule} from 'primeng/primeng';
import {ToolbarModule} from 'primeng/primeng';
import {TooltipModule} from 'primeng/primeng';
import {TreeModule} from 'primeng/primeng';
import {TreeTableModule} from 'primeng/primeng';

import {AppComponent} from './app.component';
import {AppMenuComponent, AppSubMenuComponent} from './app.menu.component';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {DashboardDemoComponent} from './demo/view/dashboarddemo.component';
import {SampleDemoComponent} from './demo/view/sampledemo.component';
import {FormsDemoComponent} from './demo/view/formsdemo.component';
import {DataDemoComponent} from './demo/view/datademo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MenusDemoComponent} from './demo/view/menusdemo.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {UtilsDemoComponent} from './demo/view/utilsdemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';

import {CarService} from './demo/service/carservice';
import {CountryService} from './demo/service/countryservice';
import {EventService} from './demo/service/eventservice';
import {NodeService} from './demo/service/nodeservice';
import {ImokTestComponent} from './sungkdemo/view/imok-test/imok-test.component';
import {TableDynamicComponent} from './sungkdemo/view/table-dynamic/table-dynamic.component';
import {GridCrduComponent} from './sungkdemo/view/grid-crdu/grid-crdu.component';
import {CoreModule} from "../platform/modules/core.modules";
import {TestService} from "./sungkdemo/view/imok-test/testService";
import {MenumanageComponent} from './console/menumanage/menumanage.component';
import {ConsoleService} from './console/service/console.service';
import {RolemanageComponent} from './console/rolemanage/rolemanage.component';
import {UsermanageComponent} from './console/usermanage/usermanage.component';
import {ConsoleArraryoperService} from "./console/service/console.arraryoper.service";
import {GrantmenutoprovComponent} from './console/grantmenutoprov/grantmenutoprov.component';
import {TeamrolemanageComponent} from './console/teamrolemanage/teamrolemanage.component';
import {ConsoleRoleService} from "./console/service/console.role.service";
import {UnittreeComponent} from './console/common/unittree/unittree.component';
import {SelecttreeComponent} from './console/teamauthority/selecttree/selecttree.component';
import {TeamauthorityComponent} from './console/teamauthority/teamauthority.component';
import {RolemanagenewComponent} from './console/rolemanagenew/rolemanagenew.component';
import {GrantMenuToProvNewComponent} from './console/grant-menu-to-prov-new/grant-menu-to-prov-new.component';
import {UserdialogComponent} from './console/rolemanage/dialog/userdialog/userdialog.component';
import {MainConsoleComponent} from "./main/main-console.component";
import {TeammenuComponent} from "./console/teammenu/teammenu.component";
import {ProvbathComponent} from "./console/provbath/provbath.component";
import {TeamauthoritydistComponent} from './console/teamauthoritydist/teamauthoritydist.component';
import {TeamauthoritygroupComponent} from './console/teamauthoritygroup/teamauthoritygroup.component';
import {PasswordPipe} from "./console/teamrolemanage/PasswordPipe";
import {Teammenu2Component} from './console/teammenu-2/teammenu-2.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutes,
    HttpClientModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    ColorPickerModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,

    //  test

    // RouterModule.forRoot(
    //   [
    //     // { path: '', redirectTo: 'login', pathMatch: 'full'},
    //     { path: 'login', component: LoginComponent,
    //     },
    //     { path: 'main', component: AppComponent },
    //     { path: '**', component: PageNotFoundComponent }
    //   ])
  ],
  declarations: [
    AppComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    AppTopBarComponent,
    AppFooterComponent,
    MainConsoleComponent,
    DashboardDemoComponent,
    SampleDemoComponent,
    FormsDemoComponent,
    DataDemoComponent,
    PanelsDemoComponent,
    OverlaysDemoComponent,
    MenusDemoComponent,
    MessagesDemoComponent,
    MessagesDemoComponent,
    MiscDemoComponent,
    ChartsDemoComponent,
    EmptyDemoComponent,
    FileDemoComponent,
    UtilsDemoComponent,
    DocumentationComponent,
    ImokTestComponent,
    TableDynamicComponent,
    TableDynamicComponent,
    GridCrduComponent,
    MenumanageComponent,
    RolemanageComponent,
    UsermanageComponent,
    GrantmenutoprovComponent,
    TeamrolemanageComponent,
    UnittreeComponent,
    SelecttreeComponent,
    TeamauthorityComponent,
    RolemanagenewComponent,
    GrantMenuToProvNewComponent,
    UserdialogComponent,
    TeammenuComponent,
    ProvbathComponent,
    TeamauthoritydistComponent,
    TeamauthoritygroupComponent,
    PasswordPipe,
    Teammenu2Component,
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    CarService, CountryService, EventService, NodeService, SystemJsNgModuleLoader,
    TestService,
    ConsoleService, ConsoleArraryoperService, ConsoleRoleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
