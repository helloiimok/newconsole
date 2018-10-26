import {CodeNamePipe} from "../pipe/codename/codename_pipe";
import {NumDatePipe} from "../pipe/numdate/numdate_pipe";
import {NumberFormatPipe} from "../pipe/numberformat/numberformat_pipe";
import {NuiMultiSelectComponent} from "../tag/nui/nui-multi-select/nui-multi-select.component";
import {NuiDateComponent} from "../tag/nui/nui-date/nui-date.component";
import {NuiSelectComponent} from "../tag/nui/nui-select/nui-select.component";
import {NuiDateNavComponent} from "../tag/nui/nui-date/nui-date-nav.component";
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  ButtonModule, CalendarModule, CodeHighlighterModule, DropdownModule, GrowlModule, InputTextareaModule,
  InputTextModule, MenubarModule,
  MessagesModule, PanelModule,
  SharedModule, SplitButtonModule,
  TabMenuModule,
  TieredMenuModule, ToolbarModule,
  TreeModule
} from "primeng/primeng";
import {NuiPasswordModule} from "../tag/primeng/password/password";
import {NuiDataTableModule} from "../tag/primeng/datatable/datatable";
import {NuiDialogModule} from "../tag/primeng/dialog/dialog";


@NgModule({
  // 自定义的组件必须在这里声明
  declarations: [
    CodeNamePipe, NumDatePipe, NumberFormatPipe,
    NuiSelectComponent, NuiDateComponent, NuiMultiSelectComponent,
    // 支持导航的日期框
    NuiDateNavComponent
  ],
  // 引用的组件
  imports: [
    CommonModule, RouterModule,
    HttpModule, FormsModule, ReactiveFormsModule, ButtonModule, MessagesModule,
    InputTextModule, NuiPasswordModule, ReactiveFormsModule, TabMenuModule,
    NuiDataTableModule, CalendarModule, MenubarModule, TreeModule, TieredMenuModule,
    SharedModule, CommonModule, GrowlModule, DropdownModule,
    InputTextareaModule, CodeHighlighterModule,
    NuiDialogModule, PanelModule, ToolbarModule, SplitButtonModule,
    // GalleriaModule, MegaMenuModule, ScheduleModule,
    // AutoCompleteModule, NuiTabViewModule, MultiSelectModule, BlockUIModule, SlideMenuModule,
    // MomentModule, CheckboxModule, ProgressBarModule, ChipsModule,
    // NuiRadioButtonModule, NuiTooltipModule, NuiPaginatorModule,
    // SelectButtonModule

  ],
  exports: [

    CommonModule, RouterModule,
    HttpModule, FormsModule, ReactiveFormsModule, ButtonModule, MessagesModule,
    InputTextModule, NuiPasswordModule, ReactiveFormsModule, TabMenuModule,
    NuiDataTableModule, CalendarModule, MenubarModule, TreeModule, TieredMenuModule,
    SharedModule, CommonModule, GrowlModule, DropdownModule,
    InputTextareaModule, CodeHighlighterModule,
    NuiDialogModule, PanelModule, ToolbarModule, SplitButtonModule,

    // CommonModule, HttpModule, RouterModule,
    // FormsModule, ReactiveFormsModule, ButtonModule, MessagesModule,
    // InputTextModule, ReactiveFormsModule, CalendarModule,
    // SharedModule, CommonModule, GrowlModule, DropdownModule, TieredMenuModule,
    // NuiDialogModule, PanelModule, AutoCompleteModule, NuiTabViewModule, MultiSelectModule,
    // MomentModule, CheckboxModule, ProgressBarModule, SlideMenuModule,
    // NuiRadioButtonModule, NuiTooltipModule, NuiDataTableModule, NuiPaginatorModule,
    //
    // CodeNamePipe, NumDatePipe, NumberFormatPipe, NuiEchartsComponent,
    // NuiSelectComponent, NuiDateComponent, NuiMultiSelectComponent, NuiDateNavComponent,
    // EchartsNg2Module, SelectButtonModule
    // NuiRadioButtonModule, NuiTooltipModule, NuiPaginatorModule,
    //  SelectButtonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlatformShareModule {
}
