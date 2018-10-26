import {Component, OnInit} from '@angular/core';
import {CarService} from "../../demo/service/carservice";
import {ConsoleArraryoperService} from "../service/console.arraryoper.service";
import {NodeService} from "../../demo/service/nodeservice";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {TestService} from "../../sungkdemo/view/imok-test/testService";
import {ConsoleService} from "../service/console.service";
import {Message, TreeNode} from "primeng/primeng";

@Component({
  selector: 'app-grantmenutoprov',
  templateUrl: './grantmenutoprov.component.html',
  styleUrls: ['./grantmenutoprov.component.css']
})
export class GrantmenutoprovComponent implements OnInit {
  msgs: Message[];
  files2: TreeNode[] = [];
  selectedFile2: TreeNode;
  node: TreeNode[];

  provs: any[];
  selectProvs: any[];

  dataChange: any[];

  constructor(private carService: CarService,
              private nodeService: NodeService,
              private testService: TestService,
              private conService: ConsoleService,
              private dialogService: DialogService,
              private consoleArraryoperService: ConsoleArraryoperService) {
  }

  ngOnInit() {
    this.readMenu();
    // this.getProvRole();
  }


  readMenu = () => {

    const successFunc: any = (
      response => {
        // 成功回调
        debugger;
        // this.menuForm ={};
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
        this.files2[0].expanded = true;
      }
    );

    debugger;
    this.conService.queryAdminUserMenu({}, successFunc);
  }

  getProvRole = () => {
    const successFunc: any = (
      response => {
        // 成功回调
        debugger;
        let res = response.body.resultList.data;
        this.provs = this.conService.transToLowerKeyArray(res);

      });
    debugger;
    this.conService.queryProvsRole({}, successFunc);
  }
  /**
   * 功能：根据指定的菜单ID，查询各省的角色是否包含该制定的ID
   * @param {string} menu_id
   */
  getProvRoldByMenuID = (menu_id: string) => {

    const successFunc: any = (
      response => {
        // 成功回调
        debugger;
        this.dataChange = [];
        let res = response.body.resultList.data;
        res = this.conService.transToLowerKeyArray(res);
        this.selectProvs = res;
        this.dataChange = res;
      });
    debugger;
    this.conService.queryProvsRoleByMenuID({resource_id: menu_id}, successFunc);
  }

  /**
   * 权限保存
   */
  saveAuth = () => {
    debugger;
    const successFunc = (response => {
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
      this.dialogService.success('保存成功');
    });


    const data = {
      options: {opt: 'modifydata'},
      changeData: this.dataChange,
      // role_id: this.selectProvs[].id,
      prm_role_type: 'adminRole',
      prm_menu_id: this.selectedFile2.data.id,
      prm_menu_parent_id: this.selectedFile2.data.parentid


    }

    this.conService.saveAuthBath(data, successFunc);
  }


  /**
   * 树的选中事件
   * @param event
   */
  nodeSelect = (event) => {
    debugger;
    const item = event.node.data;
    this.getProvRoldByMenuID(item.id);
  }

  /**
   * 处理选择行选择事件
   * @param event
   */
  handleRowSelect = (event) => {
    const item = event.data;
    let count = 0;
    for (let i in this.dataChange) {
      if (this.dataChange[i].id == item.id) {
        this.dataChange[i]['addflg'] = '1';
        count++;
      }
    }
    if (count == 0) {
      item['addflg'] = '1';
      this.dataChange.push(item);
    }

  }
  /**
   * 未选中事件
   * @param event
   */
  handleRowUnSelect = (event) => {
    debugger;
    const item = event.data;
    let count = 0;
    for (let i in this.dataChange) {
      if (this.dataChange[i].id == item.id) {
        this.dataChange[i]['addflg'] = '-1';
        count ++;
      }
    }
    if (count == 0){
      item['addflg'] = '-1';
      this.dataChange.push(item);
    }
  }
}

