import {
  Component, OnInit, AfterViewInit, OnDestroy, ViewChild
} from '@angular/core';
import { LoginService } from '../login/login.service';
import {TabItem} from "./main-tab.service";
import {MenuService, MenuData, NuiMenuNode} from "../menu/menu.service";
import {NuiBizTabViewComponent} from "../../tag/nui/nui-tabview/nui-biz-tabview.component";
import {MenuItem} from "primeng/primeng";
import {ChangePasswordComponent} from "../../sys/change-password/change-password.component";

declare var document: any;
declare var window: any;

@Component({
  selector: 'app-main-layout',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.css']
})

export class MainComponent implements OnInit, OnDestroy, AfterViewInit {

  overlayMenuActive = true;
  staticMenuDesktopInactive = false;
  staticMenuMobileActive = false;
  topbarItemsVisible=false;

  _height: string;

  menuData: MenuData;

  keyWords: string = '';

  menuModels: MenuItem[];

  @ViewChild(NuiBizTabViewComponent) tabView: NuiBizTabViewComponent;
  @ViewChild(ChangePasswordComponent) changePasswordComponent: ChangePasswordComponent;
  activeTabIndex: number = 0;

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    // private resolver: ComponentFactoryResolver,
  ) {

    this.loginService.checkLogin();
    this.menuModels = this.menuService.getMenuLevel1();
  }

  ngOnInit() {
    // this.lazyLoad.receiveContext();
    this.menuData = this.menuService.initBusiTabs();
    // this.resolverSub = this.lazyLoad.contextReceived$.subscribe(resolver => {
    //   this.componentFactoryResolver = resolver.resolver;
    //   // this.injector = resolver.injector;
    // });
  }

  ngAfterViewInit(){
    let heightNum = document.documentElement.clientHeight -65-10;
    this._height = "" + heightNum + "px";
    window.onresize = (() =>
      {

      }
    );
    // console.log("widthNum=" + widthNum);

  }

  isOverlay(){
    return false;
  }

  isHorizontal(){
    return false;
  }

  changeToStaticMenu() {

  }

  changeToOverlayMenu() {

  }

  changeToHorizontalMenu() {

  }
  onMenuClick($event) {

  }

  ngOnDestroy() {
    // this.resolverSub.unsubscribe();
  }

  onTabClosed($event){
    // this.tabView.op
    // this.menuService.closeTab($event.index);
    // debugger;
    // $event.close();
  }

  openTab(selectedMenu: NuiMenuNode){
    let isOpened = this.menuService.isOpened(selectedMenu);
    if(isOpened) {
      this.tabView.updatePanelStatus(this.menuData.tabs);
      // console.log("==该菜单已打开。菜单：" + selectedMenu.label + "(ID:" + selectedMenu.id + ")" + " ;Component=" + selectedMenu.component);
    } else {
      // 打开新的Tab页
      // 查询当前菜单对应的组件信息
      // let component: any = this.getComponentTypeByName(selectedMenu.component);
      let component: any = selectedMenu.component;
      if(component != null){
        for(let item of this.menuData.tabs){
          item.selected = false;
        }

        this.tabView.updatePanelStatus(this.menuData.tabs);
        // 添加Tab页
        // debugger;
        const newTab = new TabItem(selectedMenu.id, selectedMenu.label, component, selectedMenu.param);
        this.menuData.tabs.push(newTab);
        this.menuService.setCurrentTab(newTab);
        this.menuData.activeTabIndex = this.menuData.tabs.length - 1;
        // console.log("==打开新Tab页。菜单：" + selectedMenu.label + "(ID:" + selectedMenu.id + ")" + " ;Component=" + selectedMenu.component);
      } else {
        // 错误信息
        // console.log("==菜单：" + selectedMenu.label + "(ID:" + selectedMenu.id + ")" + "对应的Component:" + selectedMenu.component + "不存在。");
      }
    }
  }

  doMenuFilter(){
    this.menuModels = this.menuService.doMenuFilter(this.keyWords);
  }

  // getComponentTypeByName(name: string){
  //   let result = null;
  //   if(name) {
  //     debugger;
  //     const factories = Array.from(this.componentFactoryResolver['_factories'].keys());
  //     result = <Type<any>>factories.find((x: any) => x.name === name);
  //   }
  //   return result;
  // }
  openChangePwd(isShowClose: boolean) {
    this.changePasswordComponent.open(isShowClose);
  }
}
