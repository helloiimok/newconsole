
import {
  Injectable,
  ComponentFactoryResolver, ApplicationRef, Input
} from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {MenuItem} from "primeng/components/common/api";
import {TabItem} from "../main-biz/main-tab.service";
import {WelcomeComponent} from "../welcome/welcome.component";

@Injectable()
export class MenuService {

  // 菜单资源的根节点ID
  private rootMenuId: string = 'menuManager'; // resourceManager下面还有一个菜单管理

  // 菜单Map，以ParentID为key
  private menuMap: {[key: string]: NuiMenuNode[]} = {};
  private rootMenu: NuiMenuNode

  // private tabs: TabItem[] = [];
  private menuData = new MenuData(new Array<TabItem>(), 0);
  private currentTab: TabItem;

  @Input() message: string;

  constructor(private http: Http,
              private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef) {

  }

  /**
   * 初始化菜单信息
   * @param menuInfo
   */
  initMenuMap(menuInfo: Menu[]){
    // 初始化组织Map
    if(menuInfo.length == 0){
      return;
    }
    for(let menu of menuInfo){
      let isNew = false;
      const parentId = menu.parentId;
      let menuNodes = this.menuMap[parentId];
      if(!menuNodes){
        isNew = true;
        menuNodes = new Array<NuiMenuNode>();
      }
      menuNodes.push(this.createNewCode(menu));
      if(isNew) {
        this.menuMap[parentId] = menuNodes;
      }
    }
    // 初始化菜单树
    this.rootMenu = new NuiMenuNode(this.rootMenuId, "资源管理", null, null, null);
    this.createMenuTree(this.rootMenu);
  }

  createNewCode(menu: Menu): NuiMenuNode{
    return new NuiMenuNode(menu.id, menu.label, menu.parentId, menu.component, null, menu.param, menu.image, menu.url);
  }

  createMenuTree(menu: NuiMenuNode){
    let children = this.menuMap[menu.data];
    if(children){
      menu.items = children;
      // 有子菜单时，已经在左前加了加减号，所以先不添加图标了
      // if(!menu.icon){
      //   menu.icon = 'fa fa-fw fa-bars';
      // }
      // this.updateTreeIcon(menu);
      for(let child of menu.items){
        this.createMenuTree(child);
      }
    } else {
      if(!menu.icon){
        menu.icon = 'fa fa-fw fa-list-alt';
      }
    }
  }

  getMenuLevel1(): NuiMenuNode[]{
    let nodes = this.menuMap[this.rootMenuId];
    return nodes? nodes: [];
  }

  // 初始化Welcome页面
  initBusiTabs(): MenuData{
    // 如果欢迎页存在了，则不再添加欢迎页
    if(this.menuData && this.menuData.tabs && this.menuData.tabs.length == 0){
      let welcomeTab = new TabItem('welcome', '欢迎页', 'WelcomeComponent');
      welcomeTab.closable = false;
      this.menuData.tabs.push(welcomeTab);
      this.menuData.activeTabIndex = 0;
    }
    return this.menuData;
  }

  /**
   * 判断当前点击的菜单是否已经打开，如果已经打开，则是Tab也置于选中状态。
   *
   * @param node
   * @returns {boolean}
   */
  isOpened(node: NuiMenuNode): boolean{

    let isOpened = false;
    // debugger;
    if(node.component) {
      // 首先根据ID查找是否已经有页面打开，如果有就不打开新的页面了
      for (let item of this.menuData.tabs) {
        if (item.id == node.id) {
          isOpened = true;
          break;
        }
      }
      if (isOpened) {
        this.menuData.tabs.forEach((currentValue, index) => {
          if (currentValue.id == node.id) {
            currentValue.selected = true;
            this.setCurrentTab(currentValue);
            this.menuData.activeTabIndex = index;
          } else {
            currentValue.selected = false;
          }
        });

      }
    }
    return isOpened;
  }

  /**
   * 关闭Tab也时，将业务组件信息从Tabs中删除
   * @param index
   */
  closeTab(idx: number){
    // debugger;
    this.menuData.tabs.splice(idx, 1);
    if(this.menuData.tabs.length > idx){
      this.menuData.activeTabIndex = idx;
    } else {
      this.menuData.activeTabIndex = this.menuData.tabs.length - 1;
    }

    for(const index in this.menuData.tabs){
      if(Number(index) == this.menuData.activeTabIndex) {
        this.menuData.tabs[index].selected = true;
      } else {
        this.menuData.tabs[index].selected = false;
      }
    }
  }

  /**
   * 取得当前激活的Tab信息
   * @returns {TabItem}
   */
  getCurrentTab(): TabItem{
    return this.currentTab;
  }

  setCurrentTab(tab?: TabItem, index?: number) {
    if(index != null && index != undefined){
      this.currentTab = this.menuData.tabs[index];
    } else if(tab) {
      this.currentTab = tab;
    }

    // console.log('当前菜单：' + (this.currentTab ? (this.currentTab.id + ' label=' + this.currentTab.label): '没取到'));
  }

  doMenuFilter(keyWords: string): MenuItem[] {
    let keys: string[] = [];
    let filterResult: MenuItem[] = this.getMenuLevel1();
    // 如果没有录入任何关键字
    if(keyWords != null && keyWords.trim().length > 0) {
      // 全角空格先转换为半角空格
      const keyTemp = keyWords.trim().replace('　', ' ');
      keys = keyTemp.split(' ');
    }

    // console.log('关键字为：' + keys);
    if(keys.length > 0) {
      if(this.getMenuLevel1() && this.getMenuLevel1().length > 0) {
        filterResult = this.doFilter(keys, this.getMenuLevel1());
      }
    }

    return filterResult? filterResult: [];
  }

  private doFilter(keys: string[], target: NuiMenuNode[]): NuiMenuNode[] {
    let resultArray: NuiMenuNode[] = [];

    for(let menu of target) {
      if(menu.items && menu.items.length > 0){
        // 如果子节点命中，则父节点不需要再判断
        let temp = this.doFilter(keys, menu.items);
        if(temp.length > 0) {
          let menuClone = menu.clone();
          menuClone.items = temp;
          menuClone.expanded = true;
          resultArray.push(menuClone);
        }
      } else {
        if(this.menuFilter(keys, menu)){
          resultArray.push(menu.clone());
        }
      }
    }
    return resultArray;
  }

  /**
   * 过滤核心代码
   *
   * @param keys
   * @param menu
   * @returns {boolean}
   */
  private menuFilter(keys: string[], menu: MenuItem): boolean{
    let rst = true;
    if(menu.label){
      for(let key of keys){
        if(menu.label && menu.label.indexOf(key) < 0) {
          rst = false;
        }
      }
    }
    // console.log('Menu：' + menu.label + 'keys:' + keys + '结果：' + rst);
    return rst;
  }

  /**
   * 登出后清空menuService内数据
   */
  reset(){
    this.menuMap = {};
    this.menuData = new MenuData(new Array<TabItem>(), 0);
  }
}


export class NuiMenuNode implements MenuItem{
  id: string;
  data: string;
  label: string;
  parentId: string;
  items?: NuiMenuNode[];
  icon: string;
  moduleUrl?: string; // 所在Module定义，用于懒加载
  // expandedIcon: string;
  // collapsedIcon: string;
  component: string;
  param?: any; // 页面传入参数
  command: any;
  expanded?: boolean;
  disabled?: boolean;
  visible?: boolean;

  constructor(id: string, label: string, parentId:string, component: string, children: NuiMenuNode[], param?: any, icon?: string, url?: string){
    this.id = id;
    this.data = id;
    this.label = label;
    this.parentId = parentId;
    this.items = children;
    this.component = component;
    this.moduleUrl = url;
    // if(this.children && this.children.length > 0){
    //   this.expandedIcon = "fa-folder-open";
    //   this.collapsedIcon = "fa-folder";
    // } else {
    //   this.icon = "fa-file-text-o";
    // }
    this.param = param;
    this.icon = icon;
  }

  clone(): NuiMenuNode {
    return new NuiMenuNode(this.id, this.label, this.parentId, this.component, this.items, this.param, this.icon, this.moduleUrl);
  }
}

// export class NuiMenuItem implements MenuItem{
//   id: string;
//   label: string;
//
//   constructor(id: string, label: string){
//     this.id = id;
//     this.label = label;
//   }
// }

export class MenuData{
  activeTabIndex: number;
  tabs: TabItem[];

  constructor(tabs: TabItem[], activeTabIndex: number){
    this.tabs = tabs;
    this.activeTabIndex = activeTabIndex;
  }
}

export class Menu {
  id: string;
  label: string;
  parentId: string;
  component?: string;
  image?: string;
  param?: any; // 传入参数
  url?: string;
}
