import {Component, OnInit} from '@angular/core';
import {NodeService} from "../../demo/service/nodeservice";
import {ConsoleArraryoperService} from "../service/console.arraryoper.service";
import {TreeNode} from "primeng/primeng";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {TestService} from "../../sungkdemo/view/imok-test/testService";
import {CarService} from "../../demo/service/carservice";
import {ConsoleService} from "../service/console.service";

@Component({
  selector: 'app-rolemanagenew',
  templateUrl: './rolemanagenew.component.html',
  styleUrls: ['./rolemanagenew.component.css']
})
export class RolemanagenewComponent implements OnInit {

  roles: TreeNode[];
  busiRoles: any = [];
  selRoles: TreeNode;
  // grid role 选择单行变量
  selectedRole: any = {};
  menus: TreeNode[];
  selectedMenus: TreeNode[] = [];
  //
  roleUsers: any[] = [];
  // 由于点击点击节点产生的变化
  changeArray: any[] = [];

  constructor(private carService: CarService,
              private nodeService: NodeService,
              private testService: TestService,
              private conService: ConsoleService,
              private dialogService: DialogService,
              private consoleArraryoperService: ConsoleArraryoperService) {
  }

  ngOnInit() {
    let m_aa11: any = {aar001: '0', aar009: '国扶办', aaa113: '', aar033: '0'};
    // 设置root菜单
    this.roles = [
      {
        label: '国扶办', data: m_aa11, expandedIcon: 'fa-folder-open',
        collapsedIcon: 'fa-folder', icon: '', expanded: false, children: []
      },
    ];
    //  初始化一级菜单
    let successFunc1: any = (response => {
      debugger;
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      if (res.length > 0) {
        this.roles[0].children = [];
        for (let i in res) {
          let m_node: TreeNode = {};
          m_node.label = res[i].aar009;
          m_node.data = res[i];
          m_node.children = [{}];
          m_node.expandedIcon = 'fa-folder-open';
          m_node.collapsedIcon = 'fa-folder';
          // m_node.icon = 'fa-file-image-o';
          m_node.icon = "";
          this.roles[0].children.push(m_node);
        }
      }
      this.roles[0].expanded = true;
    });

    let m_data: any = {aar033: '20', aaa113: '0'};
    this.conService.queryAa11(m_data, successFunc1);
  }


  nodeExpand(event) {

    let successFunc: any = (response => {
      debugger;
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      if (res.length > 0) {
        event.node.children = [];
        for (let i in res) {
          let m_node: TreeNode = {};
          m_node.label = res[i].aar009;
          m_node.data = res[i];
          // noinspection TypeScriptValidateTypes

          m_node.expandedIcon = 'fa-folder-open';
          m_node.collapsedIcon = 'fa-folder';
          if (event.node.data.aar033 == '60') {
            m_node.icon = 'fa-file-image-o';
            m_node.children = [];
          } else {
            m_node.icon = "";
            m_node.children = [{}];
          }
          event.node.children.push(m_node);
        }
      } else {
        event.node.children = [];
        event.node.icon = 'fa-file-image-o';
      }
    });
    debugger;
    if (event.node) {
      //in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
      // this.nodeService.getLazyFiles().then(nodes => event.node.children = nodes);
      const item = event.node.data;
      if (item.aar033 == '0')
        return;
      if (item.aar033 == '70') {
        event.node.icon = "fa-file-image-o";
        event.node.children = [];
        return;
      } else {
        let aar033 = '';
        switch (item.aar033) {
          case '0':
            aar033 = '20';
            break;
          case '20':
            aar033 = '40';
            break;
          case '40':
            aar033 = '50';
            break;
          case '50':
            aar033 = '60';
            break;
          case '60':
            aar033 = '70';
            break;
          case '70':
            break;
        }
        let m_data: any = {aar033: aar033, aaa113: item.aar001};
        this.conService.queryAa11(m_data, successFunc);
      }
    }
  }

  nodeSelect = (event) => {
    debugger;
    const item = event.node.data;


    this.queryBusiRole(item.aar001);
  }

  nodeSelect1 = (event) => {
    debugger;
    const item = event.node.data;
    let changeData: any[] = [];
    this.queryTreeNode(event.node, changeData);
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

    //
    // if(event.node.children){
    //   for (let i in event.node.children) {
    //     event.node.children[i].data['addflg'] = '1';
    //   //  同步changeArray
    //
    //     this.changeArray.push(event.node.children[i].data);
    //   }
    // }else{
    //   event.node['addflg'] = '1';
    // }
    //

  }


  // 菜单树取消选择
  nodeUnSelect1 = (event) => {
    debugger;
    const item = event.node.data;
    let changeData: any[] = [];
    this.queryTreeNode(event.node, changeData);
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

    //
    // // item['addflg'] = '-1';
    // if (event.node.children) {
    //   for (let i in event.node.children) {
    //     event.node.children[i].data['addflg'] = '-1';
    //   }
    // }else{
    //   event.node['addflg'] = '-1';
    // }
  }
  queryBusiRole = (unitid: string) => {
    let successFunc: any = (response => {
      debugger;
      // 每次刷新树节点，初始化this.changeArray
      this.changeArray = [];
      let res = response.body.resultList.data;
      this.busiRoles = this.conService.transToLowerKeyArray(res);
      if (this.busiRoles.length > 0) {
        //  默认选中第一行
        this.selectedRole = this.busiRoles[0];
        //  调用第一行刷新
        this.initMenu(this.selectedRole.id);
      }


    });

    this.conService.queryBusiRoleByUnitID({unit_id: unitid}, successFunc);
  }

  /**
   * 根据roleid初始化菜单
   * @param {string} roleid
   */
  initMenu = (roleid: string) => {
    let successFunc: any = (response => {
      debugger;
      //  显示 角色关联的账号信息

      let accountList = response.body.accountList.data;
      this.roleUsers = this.conService.transToLowerKeyArray(accountList);

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
      this.selectedMenus = selectArray;

      // expand root menu
      this.menus[0].expanded = true;

    });

    this.conService.queryMenuByRoleID({role_id: roleid}, successFunc);
  }


  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  /**
   * grid 行选择
   * @param $event
   */
  onRowSelect = ($event) => {
    let item = $event.data;
    let role_id = item.id;
    this.initMenu(role_id);
  }

  /**
   * 权限保存
   */
  saveAuth = () => {
    debugger;
    let role_id = this.selectedRole['id'];
    let changeData: any[] = [];
    // changeData = this.queryChange(this.menus, changeData);

    const data = {
      options: {opt: 'modifydata'},
      changeData: this.changeArray,
      role_id: role_id,
      prm_role_type: 'busiRole'
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
    this.conService.saveAuth(data, successFunc);
  }

  /**
   * 遍历当前节点的子节点，将所有的直接点都放到返回的数组中，并增加一个addflg的属性='1'
   * @param {any[]} treenode
   * @returns {any[]}
   */
  private queryTreeNode(treenode: any, changeDate: any[]): any[] {
    if (treenode.children && treenode.children.length > 0) {
      for (let i in treenode.children) {
        this.queryTreeNode(treenode.children[i], changeDate);
      }
    } else {
      // 设置标志位addflg,后期在存储过程中使用
      // treenode[i].data['addflg'] =addflg;
      changeDate.push(treenode.data);
    }

    return changeDate;
  }


  /**
   * 变化数据提取，提取在原来基础上做的变化数据，不包含从数据库中先检索出来的数据
   * @param {any[]} treenode
   * @param {any[]} changeData
   * @returns {any[]}
   */
  private queryChange(treenode: any[], changeData: any[]): void {
    for (let i in treenode) {
      if (treenode[i].data['addflg'] && treenode[i].data['checked'] == '0' && treenode.length < 40 && treenode[i].data['addflg'] == '1' ||
        (treenode[i].data['checked'] == '1' && treenode.length < 40 && treenode[i].data['addflg'] == '-1')) {
        changeData.push(treenode[i].data);
        if (treenode[i].children) {
          this.queryChange(treenode[i].children, changeData);
        }
      } else {
        if (treenode[i].children) {
          this.queryChange(treenode[i].children, changeData);
        }
      }
    }
  }


}
