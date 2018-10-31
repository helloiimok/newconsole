import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {ImokTestComponent} from './sungkdemo/view/imok-test/imok-test.component';
import {TableDynamicComponent} from './sungkdemo/view/table-dynamic/table-dynamic.component';
import {GridCrduComponent} from './sungkdemo/view/grid-crdu/grid-crdu.component';
import {LoginComponent} from '../platform/main/login/login.component';
import {MenumanageComponent} from './console/menumanage/menumanage.component';
import {RolemanageComponent} from './console/rolemanage/rolemanage.component';
import {GrantmenutoprovComponent} from './console/grantmenutoprov/grantmenutoprov.component';
import {TeamrolemanageComponent} from './console/teamrolemanage/teamrolemanage.component';
import {TeamauthorityComponent} from './console/teamauthority/teamauthority.component';
import {GrantMenuToProvNewComponent} from './console/grant-menu-to-prov-new/grant-menu-to-prov-new.component';
import {UsermanageComponent} from './console/usermanage/usermanage.component';
import {MainConsoleComponent} from './main/main-console.component';
import {TeammenuComponent} from './console/teammenu/teammenu.component';
import {ProvbathComponent} from './console/provbath/provbath.component';
import {TeamauthoritydistComponent} from './console/teamauthoritydist/teamauthoritydist.component';
import {TeamauthoritygroupComponent} from './console/teamauthoritygroup/teamauthoritygroup.component';
import {Teammenu2Component} from './console/teammenu-2/teammenu-2.component';
import {SmartbiComponent} from '../platform/main/smartbi/smartbi.component';
import {RoleUserManageComponent} from './console/role-user-manage/role.user.manage.component';


export const routes: Routes = [
  // {path: 'main', component: DashboardDemoComponent},

  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'main', component: MainConsoleComponent,
    children: [
      // {path: 'sample', component: SampleDemoComponent},
      // {path: 'forms', component: FormsDemoComponent},
      // {path: 'data', component: DataDemoComponent},
      // {path: 'panels', component: PanelsDemoComponent},
      // {path: 'overlays', component: OverlaysDemoComponent},
      // {path: 'menus', component: MenusDemoComponent},
      // {path: 'messages', component: MessagesDemoComponent},
      // {path: 'misc', component: MiscDemoComponent},
      // {path: 'empty', component: EmptyDemoComponent},
      // {path: 'charts', component: ChartsDemoComponent},
      // {path: 'file', component: FileDemoComponent},
      // {path: 'utils', component: UtilsDemoComponent},
      // {path: 'documentation', component: DocumentationComponent},
//    demo
      {path: 'imokTest', component: ImokTestComponent},
      {path: 'table_dynamic_column', component: TableDynamicComponent},
      {path: 'GridCrduComponent', component: GridCrduComponent},
      //console
      {path: 'MenumanageComponent', component: MenumanageComponent},
      {path: 'RolemanageComponent', component: RolemanageComponent},
      {path: 'GrantmenutoprovComponent', component: GrantmenutoprovComponent},
      {path: 'TeamrolemanageComponent/:menuParam', component: TeamrolemanageComponent},
      {path: 'TeamauthorityComponent', component: TeamauthorityComponent},
      {path: 'GrantMenuToProvNewComponent', component: GrantMenuToProvNewComponent},
      {path: 'UsermanageComponent', component: UsermanageComponent},
      {path: 'TeammenuComponent/:menuParam', component: TeammenuComponent},
      {path: 'ProvbathComponent', component: ProvbathComponent},
      {path: 'TeamauthoritydistComponent', component: TeamauthoritydistComponent},
      {path: 'TeamauthoritygroupComponent', component: TeamauthoritygroupComponent},
      {path: 'Teammenu2Component/:menuParam', component: Teammenu2Component},
      {path: 'RoleUserManageComponent', component: RoleUserManageComponent},

      // 20180720 jins 新控制台集成SmartBI
      {path: 'smartbi/:param', component: SmartbiComponent},

    ]
  },


];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
