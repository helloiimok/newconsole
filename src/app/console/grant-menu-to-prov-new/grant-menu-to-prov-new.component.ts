import {Component, OnInit} from '@angular/core';
import {Message, TreeNode} from "primeng/primeng";
import {ConsoleService} from "../service/console.service";
import {TestService} from "../../sungkdemo/view/imok-test/testService";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {CarService} from "../../demo/service/carservice";
import {NodeService} from "../../demo/service/nodeservice";
import {ConsoleArraryoperService} from "../service/console.arraryoper.service";

@Component({
  selector: 'app-grant-menu-to-prov-new',
  templateUrl: './grant-menu-to-prov-new.component.html',
  styleUrls: ['./grant-menu-to-prov-new.component.css']
})
export class GrantMenuToProvNewComponent implements OnInit {
  msgs: Message[] = [];
  provs: any[] = [];
  selectProv: any = {};

  menus: TreeNode[] = [];
  selectedMenu: TreeNode[] = [];

  changeArray: any[] = [];

  constructor(private carService: CarService,
              private nodeService: NodeService,
              private testService: TestService,
              private conService: ConsoleService,
              private dialogService: DialogService,
              private consoleArraryoperService: ConsoleArraryoperService,
  ) {
  }

  ngOnInit() {
    this.queryProvs();
  }

  queryProvs = () => {
    const successFunc: any = (
      response => {
        // 成功回调
        debugger;
        // this.menuForm ={};
        this.provs = [];
        // 数据源表的下拉列表赋值
        let res = response.body.resultList.data;
        this.provs = this.conService.transToLowerKeyArray(res);
      });

    this.conService.queryProvs({}, successFunc);
  }


  handleRowSelect = (event) => {
    // this.readMenu(this.selectProv.aar001);
    const item = event.data;
    this.initMenu(item.aar001);
  }

  handleRowUnSelect($event) {

  }

  /**
   * 根据roleid初始化菜单
   * @param {string} roleid
   */
  initMenu = (roleid: string) => {
    let successFunc: any = (response => {
      debugger;
      //  显示 角色关联的账号信息
      // let accountList = response.body.accountList.data;
      // this.menus = this.conService.transToLowerKeyArray(accountList);

      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      let menuArray: TreeNode = {};
      let selectArray: TreeNode[] = [];
      //  初始化菜单树
      this.menus = [];
      let menuList: TreeNode[] = [];
      res.forEach(function (value, i) {
        let nodeMenu: TreeNode = {};
        nodeMenu['label'] = value['title'];
        nodeMenu['data'] = value;
        nodeMenu['children'] = [];
        nodeMenu['icon'] = "fa-file-image-o";
        nodeMenu['id'] = value['id'];
        // 初始化已选择的菜单
        nodeMenu['checked'] = value['checked']
        if (nodeMenu['checked'] == 1) {
          selectArray.push(nodeMenu);
        }
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
      this.menus.push(menuArray);
      this.selectedMenu = selectArray;

      // expand root menu
      this.menus[0].expanded = true;

    });

    this.conService.queryMenuByAdminRoleID({admin_role_id: roleid}, successFunc);
  }

  nodeSelect = (event) => {
    debugger;
    const item = event.node.data;
    let changeData: any[] = [];
    this.consoleArraryoperService.queryTreeNode(event.node, changeData, 'add');
    for (let i in changeData) {
      let ind: number = this.consoleArraryoperService.findByID(this.changeArray, changeData[i].id);
      if (ind >= 0) {
        this.changeArray.splice(ind, 1);
        changeData[i]['addflg'] = '1';
      } else {
        changeData[i]['addflg'] = '1';
      }
      this.changeArray.push(changeData[i]);
    }

  }
// 菜单树取消选择
  nodeUnSelect = (event) => {
    debugger;
    const item = event.node.data;
    let changeData: any[] = [];
    this.consoleArraryoperService.queryTreeNode(event.node, changeData, 'del');
    for (let i in changeData) {
      let ind: number = this.consoleArraryoperService.findByID(this.changeArray, changeData[i].id);
      if (ind >= 0) {
        this.changeArray.splice(ind, 1);
        changeData[i]['addflg'] = '-1';
      } else {
        changeData[i]['addflg'] = '-1';
      }
      this.changeArray.push(changeData[i]);
    }
  }
  /**
   * 权限保存
   */
  saveAuth = () => {
    debugger;
    let role_id = this.selectProv.aar001;
    let changeData: any[] = [];
    // changeData = this.queryChange(this.menus, changeData);

    const data = {
      options: {opt: 'modifydata'},
      changeData: this.changeArray,
      admin_role_id: role_id,
      prm_role_type: 'adminRole',
      type: 'old',
    };

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
      // 保存成功后也需要初始化this.changeArray = [];
      this.changeArray = [];
      this.dialogService.success('保存成功');
    });
    this.conService.saveAuthAdmin(data, successFunc);
  }


}
