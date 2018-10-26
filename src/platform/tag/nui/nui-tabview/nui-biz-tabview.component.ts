/**
 * Created by jins on 2017/4/19.
 */
import {
  NgModule, Component, Input, Output, EventEmitter, HostListener, AfterContentInit, ContentChildren,
  QueryList, ViewChild, OnChanges, SimpleChanges, AfterViewInit, AfterContentChecked
} from '@angular/core';
import {TabView} from "primeng/components/tabview/tabview"
import {TabItem} from "../../../main/main-biz/main-tab.service";
import {MenuService} from "../../../main/menu/menu.service";

declare var document: any;
declare var window: any;

@Component({
  selector: 'nui-biz-tabView',
  template: `
        
    <p-tabView [id]="id" class="ui-tabview-panels"  fxFlexFill (onChange)="onChangeExd($event)" [controlClose]="true" (onClose)="onCloseExd($event)">
      <p-tabPanel *ngFor="let tab of tabs"
        header="{{tab.label}}" [selected]="tab.selected" [closable]="tab.closable"
        class="ui-tabview-panel" fxFlexFill id="{{tab.id}}" lazy="true">
         <div [ngStyle]="{'height': _height,'width':_width}" class="tab-content-lb">
          <busi-tab [tab]="tab"></busi-tab>
          </div>
      </p-tabPanel>
    </p-tabView>
    `,
})
/**
 * PrimeNG V2.0.6的TabView中还不支持activeIndex，所以参考V4版本的内容，进行了封装
 */
export class NuiBizTabViewComponent implements OnChanges, AfterViewInit{

  @ViewChild(TabView) pTabView: TabView;

  @Input() id: string;

  @Input() tabs: TabItem[];

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  @Input("activeIndex") activeIndex: number;

  _height: string;
  _width: string;

  constructor(private menuService: MenuService) {
  }

  onChangeExd($event) {
    this.menuService.setCurrentTab(null, $event.index);
    if(this.onChange){
      this.onChange.emit($event);
    }
  }

  onCloseExd($event){
    // 将TabPanel去掉。
    this.menuService.closeTab($event.index);
    this.pTabView.tabs.splice($event.index, 1);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName == 'tabs') {
        if(this.pTabView && this.pTabView.tabs){
          for(let index in this.tabs){
            this.pTabView.tabs[index].selected = this.tabs[index].selected;
          }
        }
      }
    }
  }

  // 设置主页面右侧纵滚
  ngAfterViewInit() {
    this.resize();
  }

  resize(){
    let heightNum = document.documentElement.clientHeight -65-38;
   // let widthNum = document.documentElement.clientWidth-250-4;
    this._height = "" + heightNum + "px";
   // this._width = "" + widthNum + "px";
    //console.log("widthNum=" + widthNum);
  }

  updatePanelStatus(tabItems: TabItem[]){
    if(tabItems){
      for(let index in tabItems){
        this.pTabView.tabs[index].selected = tabItems[index].selected;
      }
    }
  }

}
