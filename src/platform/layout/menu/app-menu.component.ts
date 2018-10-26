import {Component, Input, Inject, forwardRef, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {MenuService, NuiMenuNode} from "../../main/menu/menu.service";
import {MainComponent} from "../../main/main-biz/main.component";
import {ModuleLoaderService} from "../../main/login/module-loader.service";

@Component({
  selector: 'app-menu',
  template: `
    <ul class="layout-menu  clearfix" visible="true" >
      <nui-main-menu [model]="model"></nui-main-menu>
    </ul>
  `
})
export class AppMenuComponent implements AfterViewInit, OnChanges {

  @Input() reset: boolean;
  @Input()
  model: MenuItem[];

  private menuCommand: any = ((event) => this.menuItemClick(event));

  constructor(@Inject(forwardRef(() => MainComponent)) public main: MainComponent,
              private menuService: MenuService,
              private moduleLoader: ModuleLoaderService) {
  }

  ngAfterViewInit() {
    // 注册打开业务页面的事件
    // this.registCommand(this.model);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName == 'model') {
        this.registCommand(this.model);
        break;
      }
    }
  }

  registCommand(menus: MenuItem[]) {
    if (menus) {
      for (let menu of menus) {
        menu.command = this.menuCommand;
        // TODO ?
        // this.registCommand(menu.items);
      }
    }
  }

  menuItemClick(event: any) {
    const selectedMenu = event.item;

    if (selectedMenu.moduleUrl) {
      this.moduleLoader.load(selectedMenu, ((selectedMenu) => this.openComponent(selectedMenu)));
    } else {
      if (selectedMenu.component) {
        this.openComponent(selectedMenu);
      }
    }
  }

  private openComponent(selectedNode: NuiMenuNode) {
    if (selectedNode.component) {
      this.main.openTab(selectedNode);
    }
  }
}
