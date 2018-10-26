import {Component, OnInit} from '@angular/core';
import {MenuItem, Message, Tree, TreeNode} from "primeng/primeng";
import {Car} from "../../demo/domain/car";
import {CarService} from "../../demo/service/carservice";
import {NodeService} from "../../demo/service/nodeservice";
import {TestService} from "../../sungkdemo/view/imok-test/testService";
import {ConsoleService} from "../service/console.service";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {ConsoleArraryoperService} from "../service/console.arraryoper.service";


@Component({
  selector: 'app-menumanage',
  templateUrl: './menumanage.component.html',
  styleUrls: ['./menumanage.component.css']
})
export class MenumanageComponent implements OnInit {

  msgs: Message[];
  files2: TreeNode[] = [];
  items: MenuItem[];
  selectedFile2: TreeNode;

  node: TreeNode[];
  selectedCar: Car;
  cars: Car[];

  menuForm: MenuForm = {title: '', url: '', parameters: '', order_num: 10, component: '', parentid: '', id: ""};

  constructor(private carService: CarService,
              private nodeService: NodeService,
              private testService: TestService,
              private conService: ConsoleService,
              private dialogService: DialogService,
              private consoleArraryoperService: ConsoleArraryoperService
  ) {
  }

  ngOnInit() {
    this.items = [
      {label: '新增', icon: 'fa-search', command: (event) => this.addMenu(this.selectedFile2)},
      {label: '删除', icon: 'fa-close', command: (event) => this.delMenu()}
    ];
    this.readMenu();
  }

  //新增菜单
  addMenu = (m: any) => {
    debugger;

    this.menuForm.id = '';
    this.menuForm.parentid = m['id'] + "";
    this.menuForm.title = '填写菜单名字';
    this.menuForm.order_num = 10;
    this.menuForm.component = '';
    this.menuForm.parameters = '';
    this.menuForm.url = '';
    this.menuForm.rootid = m['data']['rootid'] + "";
    this.menuForm.appid = m['data']['appid'] + "";
    let menu_node: TreeNode = {label: this.menuForm.title, data: this.menuForm, children: [], icon: "fa-file-image-o"};
    menu_node['id'] = this.menuForm.id + "";
    m['expandedIcon'] = "fa-folder-open";
    m['collapsedIcon'] = "fa-folder";
    m['icon'] = "";
    // m.children.push(menu_node);

    this.selectedFile2 = menu_node;

  }

  //删除菜单，同时更新tree节点
  delMenu = () => {
    // this.dialogService.info('del menu');
    const successFuncDel = (response => {
      debugger;
      if (response.error) {
        const list = response.error;
        this.dialogService.info(list.detail);
        return;
      }
      if (response.options.code !== 1) {
        this.dialogService.error('删除错误: ' + response.options.errorMsg);
        return;
      }
      this.menuForm = response.menuForm;
      this.delArray(this.files2, this.menuForm.parentid, this.menuForm.id);
      this.menuForm = {};
      this.dialogService.success('删除成功');

    });
    debugger;
    const data = {
      options: {opt: 'modifydata'},
      menuForm: this.menuForm
    };
    this.conService.delMenu(data, successFuncDel);

  }

  cloneMenu(c: any): any {
    const menu = {};
    for (const prop in c) {
      menu[prop] = c[prop];
    }
    return menu;
  }

  findSelectedCarIndex(): number {
    return this.cars.indexOf(this.selectedCar);
  }

  viewFile(file: TreeNode) {
    debugger;
    this.msgs = [];
    const cars = [...this.cars];
  }

  unselectFile() {
    // this.files3.pop({'data': this.selectedFile2});
    this.selectedFile2 = null;
  }


  readMenu = (expandid?: string) => {
    debugger;

    const successFunc: any = (
      response => {
        // 成功回调
        debugger;
        this.menuForm = {};
        this.selectedFile2 = {};
        // 数据源表的下拉列表赋值
        let menuArray: TreeNode = {};
        let res = response.body.resultList.data;
        res = this.conService.transToLowerKeyArray(res);

        this.files2 = [];
        let menuList: TreeNode[] = [];
        // 生成树形结构方法，前提条件，必须是从树根节点开始依次到叶子，否则会有节点挂不上的情况
        res.forEach(function (value, i) {
          let nodeMenu: TreeNode = {};
          nodeMenu['label'] = value['title'];
          nodeMenu['data'] = value;
          nodeMenu['children'] = [];
          nodeMenu['icon'] = "fa-file-image-o";

          nodeMenu['id'] = value['id'];
          // 判断id和parent_id
          if (value['parentid'] != null && value['parentid'] != "") {
            menuList.forEach(function (val, i) {
              // 此处只考虑了正序的情况，也就是从根到叶子，如果乱序，那么需要添加else部分的代码，
              // 暂时没有想好，后期可以尝试
              if (val['id'] == value['parentid']) {
                val['children'].push(nodeMenu);
                val['expandedIcon'] = "fa-folder-open";
                val['collapsedIcon'] = "fa-folder";
                val['icon'] = "";
              }
              //  返回根节点
              if (val['id'] == 'menuManager') {
                menuArray = val;
              }
            });
          }

          menuList.push(nodeMenu);
        });
        this.files2.push(menuArray);
        // this.consoleArraryoperService.expandNode(this.files2,this.menuForm.parentid);
        if (!expandid) {
          this.files2[0].expanded = true;
        } else {
          this.files2[0].expanded = true;
          const m_tree = [...this.files2];
          this.expandTreeNode(this.files2, expandid, m_tree);
        }

      }
    );

    this.files2 = [];
    this.conService.queryUserTest(this.menuForm, successFunc);
  }

  // 成功回调

  private successFunSeq: any = (
    response => {
      // 成功回调
      debugger;
      // 数据源表的下拉列表赋值
      let res = response.body.resultList.data;
      if (res.length > 0) {
        res = this.conService.transToLowerKeyArray(res);
        this.menuForm.id = res[0].seq_val;
      }

    });

  /**
   * saveMenu
   * 功能：保存修改的菜单信息
   */
  saveMenu = () => {
    const successFuncUpdate = (response => {
      debugger;
      if (response.error) {
        const list = response.error;
        this.dialogService.info(list.detail);
        return;
      }
      if (response.options.code !== 1) {
        this.dialogService.error('保存错误: ' + response.options.errorMsg);
        return;
      }
      this.menuForm = response.menuForm;
      let refresh_t = response.resfres_list;
      let opt_mode = response.opt_mode;  // sql的操作方式，insert和update
      this.readMenu(this.menuForm.parentid);
      // this.expandTreeNode(this.files2, this.menuForm.parentid);
      // 刷新菜单
      // let m_node = [...this.files2];
      // this.addNodeChild(m_node, this.menuForm.parentid, refresh_t);
      // this.files2 =[];
      // this.files2 = m_node;
      this.dialogService.success('保存成功');
      return;
    });
    debugger;
    if (this.menuForm.parentid == "" || this.menuForm.parentid == null) {
      this.dialogService.info('请填写菜单信息后再保存');
      return;
    }
    const data = {
      options: {opt: 'modifydata'},
      menuForm: this.menuForm
    };

    this.conService.updateMenu(data, successFuncUpdate);
  }
  nodeSelect = (event) => {
    debugger;
    const item = event.node.data;
    this.node = event.node;
    // this.node['label'] = 'aaaa';
    //  同步显示form
    this.menuForm = item;

  }

  updateRefresh = (data: any[], id: string, resList: any[]) => {
    for (var i in data) {
      if (data[i]['data']['id'] == id) {
        // 清空当前节点的children节点
        data[i]['children'] = [];
        //根据reslist重新生成children节点数组
        for (var j in resList) {
          let t_node: TreeNode = {};
          t_node.label = resList[j].title;
          t_node.data = resList[j];
          t_node['id'] = resList[j]['id'];
          t_node.icon = "fa-file-image-o";
          t_node.children = [];
          data[i].children.push(t_node);
        }
        break;
      } else {
        if (data[i]['children'].length > 0)
          this.updateRefresh(data[i]['children'], id, resList);
      }
    }

  }


  syncLable = (data, id, name) => {
    for (var i in data) {
      if (data[i]['data']['id'] == id) {
        data[i]['label'] = name;
        // this.selectedFile2['label'] = name;
        // this.node = data[i];
        // this.node['label'] = name;
        return;
      } else {
        if (data[i].children.length > 0)
          this.syncLable(data[i].children, id, name);
      }
    }
  }

  /**
   * 函数名称：delArray
   * 功能：删除数结构的选中节点元素，用于菜单删除功能，主要原理是，根据删除节点的父节点
   *       找到树形结构的元素节点，然后循环该节点的children节点，找到当前的待删除节点，
   *       从而从子节点中删除该元素，由于数据的双向绑定，树结构自动删除
   * @param data
   * @param parentid
   * @param id
   */
  delArray = (data, parentid, id) => {
    for (var i in data) {
      //查询父节点
      if (data[i]['data']['id'] == parentid) {
        let o = data[i];
        //查询并删除子节点
        for (var j in o['children']) {
          if (o['children'][j]['data']['id'] == id) {
            o['children'].splice(j, 1);
            break;
          }
        }
      } else {
        this.delArray(data[i]['children'], parentid, id);
      }
    }

  }


  expandTreeNode = (tree: TreeNode[], id: string, oldTree: TreeNode[]) => {
    debugger;
    for (let i in tree) {
      if (tree[i]['id'] == id) {
        tree[i].expanded = true;
        if (tree[i].data.id == 'resourceManager') {
          break;
        } else {
          this.expandTreeNode(oldTree, tree[i].data.parent_id, oldTree);
        }
      } else {
        if (tree[i].children) {
          this.expandTreeNode(tree[i].children, id, oldTree);
        }
      }
    }
  }

  addNodeChild = (tree: TreeNode[], id: string, childNode: TreeNode[]) => {
    for (let i in tree) {
      if (tree[i]['id'] == id) {
        tree[i].children = [];
        tree[i].children = childNode;
        tree[i].expanded = true;
        break;
      } else {
        if (tree[i].children) {
          this.addNodeChild(tree[i].children, id, childNode);
        }
      }
    }
  }


  getArray(data, id): any {
    let ret: any = {};
    for (var i in data) {
      if (data[i]['data']['id'] == id) {
        ret = data[i];
        return ret;
        // break;
      } else {
        this.getArray(data[i].children, id);
      }
    }
    return ret;
  }


}

class PrimeCar implements Car {

  constructor(public vin?, public year?, public brand?, public color?) {
    this.vin = vin ? vin : '0';
    this.year = year ? year : 2018;
    this.brand = brand ? brand : 'brand';
    this.color = color ? color : 'yello';
  }
}

export interface MenuForm {
  id?: string;
  title?: string;
  url?: string;
  order_num?: number;
  component?: string;
  parameters?: string;
  parentid?: string;
  target?: string;
  rootid?: string;
  appid?: string;
}
