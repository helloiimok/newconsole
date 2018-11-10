import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TreeNode} from 'primeng/primeng';
import {NodeService} from '../../demo/service/nodeservice';
import {DialogService} from '../../../platform/dialog/dialog.service';
import {TestService} from '../../sungkdemo/view/imok-test/testService';
import {ConsoleService} from '../service/console.service';
import {ConsoleArraryoperService} from '../service/console.arraryoper.service';
import {UserdialogComponent} from './dialog/userdialog/userdialog.component';
import {LoginService} from '../../../platform/main/login/login.service';
import {ConsoleRoleService} from '../service/console.role.service';
import {BusiRole} from './entity/busirole';


@Component({
  selector: 'app-rolemanage',
  templateUrl: './rolemanage.component.html',
  styleUrls: ['./rolemanage.component.css']
})
export class RolemanageComponent implements OnInit {

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

  busiRole: BusiRole = new BusiRole();
  displayDialog: boolean;
  displayDialog1: boolean;
  @ViewChild('g1') userDialog: UserdialogComponent;

  constructor(
    private nodeService: NodeService,
    private testService: TestService,
    private conService: ConsoleService,
    private dialogService: DialogService,
    private consoleArraryoperService: ConsoleArraryoperService,
    private loginService: LoginService,
    private consoleRoleService: ConsoleRoleService) {
  }

  ngOnInit() {
    const m_aa11: any = {aar001: '0', aar009: '国扶办', aaa113: '', aar033: '0'};
    // 设置root菜单
    this.roles = [
      {
        label: '国扶办', data: m_aa11, expandedIcon: 'fa-folder-open',
        collapsedIcon: 'fa-folder', icon: '', expanded: false, children: []
      },
    ];
    //  初始化一级菜单
    const successFunc1: any = (response => {
      // debugger;
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      if (res.length > 0) {
        this.roles[0].children = [];
        for (const i in res) {
          const m_node: TreeNode = {};
          m_node.label = res[i].aar009;
          m_node.data = res[i];
          m_node.children = [{}];
          m_node.expandedIcon = 'fa-folder-open';
          m_node.collapsedIcon = 'fa-folder';
          // m_node.icon = 'fa-file-image-o';
          m_node.icon = '';
          this.roles[0].children.push(m_node);
        }
      }
      this.roles[0].expanded = true;
    });

    const m_data: any = {aar033: '20', aaa113: '0', account: this.loginService.getUserAccount()};
    this.conService.queryAa11(m_data, successFunc1);
  }


  nodeExpand(event) {

    const successFunc: any = (response => {
      // debugger;
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      if (res.length > 0) {
        event.node.children = [];
        for (const i in res) {
          const m_node: TreeNode = {};
          m_node.label = res[i].aar009;
          m_node.data = res[i];
          // noinspection TypeScriptValidateTypes

          m_node.expandedIcon = 'fa-folder-open';
          m_node.collapsedIcon = 'fa-folder';
          if (event.node.data.aar033 === '60') {
            m_node.icon = 'fa-file-image-o';
            m_node.children = [];
          } else {
            m_node.icon = '';
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
      const item = event.node.data;
      if (item.aar033 === '0')
        return;
      if (item.aar033 === '70') {
        event.node.icon = 'fa-file-image-o';
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
        const m_data: any = {aar033: aar033, aaa113: item.aar001};
        this.conService.queryAa11(m_data, successFunc);
      }
    }
  }

  nodeSelect = (event) => {
    debugger;
    const item = event.node.data;

    this.menus = [];
    this.roleUsers = [];
    this.queryBusiRole(item.aar001);
  }

  nodeSelect1 = (event) => {
    // debugger;
    const item = event.node.data;
    const changeData: any[] = [];
    this.consoleArraryoperService.queryTreeNode(event.node, changeData, 'add');
    for (const i in changeData) {
      const ind: number = this.consoleArraryoperService.findByID(this.changeArray, changeData[i].id);
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
  nodeUnSelect1 = (event) => {
    debugger;
    const item = event.node.data;
    const changeData: any[] = [];
    this.consoleArraryoperService.queryTreeNode(event.node, changeData, 'del');
    for (const i in changeData) {
      const ind: number = this.consoleArraryoperService.findByID(this.changeArray, changeData[i].id);
      if (ind >= 0) {
        this.changeArray.splice(ind, 1);
        changeData[i]['addflg'] = '-1';
      } else {
        changeData[i]['addflg'] = '-1';
      }
      this.changeArray.push(changeData[i]);
    }
  }
  queryBusiRole = (unitid: string) => {
    const successFunc: any = (response => {
      debugger;
      // 每次刷新树节点，初始化this.changeArray
      this.changeArray = [];
      const res = response.body.resultList.data;
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
    const successFunc: any = (response => {
      debugger;
      //  显示 角色关联的账号信息
      const accountList = response.body.accountList.data;
      this.roleUsers = this.conService.transToLowerKeyArray(accountList);

      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      let menuArray: TreeNode = {};
      const selectArray: TreeNode[] = [];
      //  初始化菜单树
      this.menus = [];
      const menuList: TreeNode[] = [];
      res.forEach(function (value, i) {
        const nodeMenu: TreeNode = {};
        nodeMenu['label'] = value['title'];
        nodeMenu['data'] = value;
        nodeMenu['children'] = [];
        nodeMenu['icon'] = 'fa-file-image-o';
        nodeMenu['id'] = value['id'];
        // 初始化已选择的菜单
        nodeMenu['checked'] = value['checked']
        if (nodeMenu['checked'] == 1) {
          selectArray.push(nodeMenu);
        }
        // 判断id和parent_id
        if (value['parentid'] != null && value['parentid'] != '') {
          menuList.forEach(function (val, i) {
            // 此处只考虑了正序的情况，也就是从根到叶子，如果乱序，那么需要添加else部分的代码，
            // 暂时没有想好，后期可以尝试
            if (val['id'] == value['parentid']) {
              val['children'].push(nodeMenu);
              val['expandedIcon'] = 'fa-folder-open';
              val['collapsedIcon'] = 'fa-folder';
              val['icon'] = '';
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
    // let admin_role_id:string = roleid;
    this.conService.queryMenuByRoleID({
      admin_role_id: this.loginService.getUnitCode(),
      busi_role_id: roleid
    }, successFunc);
  }


  /**
   * 角色新增
   */
  addRole = () => {
    debugger;
    // 判断是否点击了左面的树节点
    if (!this.selRoles) {
      this.dialogService.info('请选择经办机构！');
      return;
    }
    this.busiRole = new BusiRole();
    this.busiRole.id = '0';
    this.displayDialog = true;
    this.busiRole.opt = 'add';
    // let aar001 = this.selRoles.data.aar001;
  }

  saveRole = () => {
    debugger;
    if (!this.busiRole.name) {
      this.dialogService.info('角色名称必须填写');
      return;
    }
    if (!this.busiRole.description) {
      this.dialogService.info('角色描述信息必须填写');
      return;
    }
    const data = {
      options: {opt: 'modifydata'},
      changeData: [{
        name: this.busiRole.name, description: this.busiRole.description,
        aar001: this.selRoles.data.aar001, prm_role_type:
          'busiRole', opt: this.busiRole.opt, id: this.busiRole.id,
      }],
      adminRoleId: this.selRoles.data.aar001,
      type: 'business',
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
      const res = response.resultList;
      this.busiRoles = this.conService.transToLowerKeyArray(res);
      this.dialogService.success('保存成功');
      this.displayDialog = false;
    });
    this.conService.saveRole(data, successFunc);
  }


  delTeam = (team: any) => {
    debugger;
    const parm = team;
    const callBack = (() => {
      this.delTeam1(parm);
    });
    const cancelCallBack = (() => {
      this.dialogService.info('1111');
    });
    this.dialogService.question('是否执行删除操作？', cancelCallBack);
  }

  delTeam1 = (team: any) => {
    debugger;
    // this.dialogService.info(team['id']);
    team['opt'] = 'del';
    const data = {
      options: {opt: 'modifydata'},
      changeData: [{
        prm_role_id: team.id,
        opt: team['opt'],
        type: 'old'
      }],
      adminRoleId: this.selRoles.data.aar001,
    };

    const successFunc = (response => {
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
      // 保存成功后也需要初始化this.changeArray = [];
      this.changeArray = [];
      const res = response.resultList;
      this.busiRoles = this.conService.transToLowerKeyArray(res);
      this.dialogService.success('删除成功');
      this.displayDialog = false;
    });
    this.conService.saveRole(data, successFunc);
  }

  modiTeam = (team: any) => {
    debugger;
    this.busiRole = team;
    this.busiRole['opt'] = 'update';
    this.displayDialog = true;
    return null;
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
    const item = $event.data;
    const role_id = item.id;
    this.initMenu(role_id);
  }

  onRowUnselect = ($event) => {
    this.menus = [];
    this.changeArray = [];
  }
  /**
   * 权限保存
   */
  saveAuth = () => {
    debugger;
    const role_id = this.selectedRole['id'];
    const changeData: any[] = [];
    // this.queryChange(this.menus, changeData);

    const data = {
      options: {opt: 'modifydata'},
      changeData: this.changeArray,
      role_id: role_id,
      prm_role_type: 'busiRole',
      aar001: this.selRoles.data.aar001,
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
    this.conService.saveAuthConsole(data, successFunc);
  }

  addUser = () => {
    this.displayDialog1 = true;
    if (!this.selRoles) {
      this.dialogService.info('请选择经办机构！');
      this.displayDialog1 = false;
      return;
    } else {
      this.userDialog.unit_id = this.selRoles.data.aar001;
      this.userDialog.role_id = this.selectedRole.id;
      this.userDialog.getUser();
    }

  }
  userClose = () => {
    this.displayDialog1 = false;
  }

  delBindUser = (user) => {
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
      const tmp: any[] = [...this.roleUsers];
      let rowidx = 0;
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].id == user.id) {
          rowidx = i;
          break;
        }
      }
      tmp.splice(rowidx, 1);
      this.roleUsers = tmp;
      this.dialogService.success('删除成功');
    });
    debugger;
    const data = {
      options: {opt: 'modifydata'},
      changeData: [{id: user.id}],
      role_id: this.selectedRole.id,
      opt: 'del',
    };
    this.consoleRoleService.saveRoleUnBindUsers(data, successFunc);
  }


  /**
   * 变化数据提取，提取在原来基础上做的变化数据，不包含从数据库中先检索出来的数据
   * @param {any[]} treenode
   * @param {any[]} changeData
   * @returns {any[]}
   */
  private queryChange(treenode: any[], changeData: any[]): void {
    for (const i in treenode) {
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
