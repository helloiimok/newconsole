import {Component, OnInit} from '@angular/core';
import {ConsoleService} from "../service/console.service";
import {MenuItem, TreeNode} from "primeng/primeng";
import {LoginService} from "../../../platform/main/login/login.service";
import {ConsoleRoleService} from "../service/console.role.service";
import {ConsoleArraryoperService} from "../service/console.arraryoper.service";
import {DialogService} from "../../../platform/dialog/dialog.service";

@Component({
  selector: 'app-teamauthoritygroup',
  templateUrl: './teamauthoritygroup.component.html',
  styleUrls: ['./teamauthoritygroup.component.css']
})
export class TeamauthoritygroupComponent implements OnInit {

  roles: any[] = [];
  readySelRole: any = {};
  teams: any[] = [];
  alreadyRoles: any[] = [];
  alreadySelRole: any = {};
  selectedRole: any = {};
  //
  items: MenuItem[]; // cm
  items1: MenuItem[]; //cm1
  constructor(private consoleRoleService: ConsoleRoleService,
              private  conService: ConsoleService,
              private  loginService: LoginService,
              private dialogService: DialogService,
              private nodeService: ConsoleArraryoperService) {
    this.items = [
      {label: '新增', icon: 'fa-search', command: (event) => this.addMenuReady(this.readySelRole)},
    ];
    this.items1 = [
      {label: '删除', icon: 'fa-close', command: (event) => this.delMenuAlready()}
    ];
  }

  ngOnInit() {
    debugger;
    this.initTreeFir();
    this.queryRoleByCreater(this.loginService.getUserAccount());
  }

  private successFuncAuth = (response => {
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
    let res = response.resultList;
    res = this.conService.transToLowerKeyArray(res);

    this.alreadyRoles = this.makeTree(res);
    this.alreadyRoles[0].expanded = true;
    this.dialogService.success('保存成功');
  });

  addMenuReady = (m: any) => {
    debugger;

    let str_t = Symbol(this.loginService.getUserAccount());
    // 99admin匹配情况
    if (this.loginService.getUserAccount().match("^99[0-9]{0}admin")) {
      // this.dialogService.info('省');
      if (m.data['aar033'] != '20') {
        this.dialogService.info('只能增加省一级的权限，请选择到省！');
        return;
      }
    }
    // 匹配99xxadmin 片区
    if (this.loginService.getUserAccount().match("^99[0-9]{2}admin")) {
      if (m.data['aar033'] != '50') {
        this.dialogService.info('只能增加县一级的权限，请选择到县！');
        return;
      }
    }
    // 匹配 队长
    if (this.loginService.getUserAccount().match("^99[0-9]{4}admin")) {
      if (m.data['aar033'] != '70') {
        this.dialogService.info('只能增加村一级的权限，请选择到村！');
        return;
      }
    }

    // 保存信息到 权限表，同时刷新已授权的树结构
    if (!this.selectedRole) {
      this.dialogService.info('请先选择需要添加的组信息！');
      return;
    }
    let t1: boolean;
    let t: boolean = this.nodeService.findNodeByAar001(this.alreadyRoles, m.data.aar001);
    if (t == true) {
      this.dialogService.info('该行政区划已经授权,请选择其他行政区划授权!');
      return;
    }


    const data1 = {};
    data1['roleId'] = this.selectedRole.id;
    data1['resourceId'] = m.data.aar001;
    data1['resourceType'] = 'mobile';
    data1['authorityType'] = 'mobile';
    data1['opt'] = 'add';
    if (this.loginService.getUserAccount().match("^99[0-9]{0}admin") ||
      this.loginService.getUserAccount().match("^99[0-9]{2}admin")) {
      data1['roleType'] = 'adminRole';
    } else if (this.loginService.getUserAccount().match("^99[0-9]{4}admin")) {
      data1['roleType'] = 'busiRole';
    }
    const data = {
      options: {opt: 'modifydata'},
      changeData: [data1],
    };
    this.conService.saveAuthority(data, this.successFuncAuth);
  }


  delMenuAlready = () => {
    debugger;
    const data = {
      options: {opt: 'modifydata'},
      changeData: [{aar001: this.alreadySelRole.data.aar001, role_id: this.selectedRole.id, opt: 'del'}],
    };
    this.conService.saveAuthority(data, this.successFuncAuth);

  }


  onRowSelect = ($event) => {
    debugger;
    const item = $event.data;
    this.alreadyRoles = [];
    this.initTreeSec(item.id);
  }
  onRowUnselect = ($event) => {
    this.alreadyRoles = [];
  }

//  ////////////////////////////////////第二个树的操作
  initTreeFir(): void {
    let successFunc1: any = (response => {
      debugger;
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);

      this.roles = this.makeTree(res);
      this.roles[0].expanded = true;
    });
    let m_data: any = {aar033: '20', aaa113: '0', account: this.loginService.getUserAccount()};
    this.conService.queryAa11Xian(m_data, successFunc1);

  }

  /**
   * 根据登录账号的行政区划（管理账号的管理角色id，admin_role_id）进行查询
   * @param {string} account
   */
  queryRoleByCreater = (account: string) => {
    const successFunc: any = (
      response => {
        // 成功回调
        debugger;
        let res = response.body.resultList.data;
        res = this.conService.transToLowerKeyArray(res);
        this.teams = res;

      });

    this.consoleRoleService.queryRoleByCreaterMobile({create_by: this.loginService.getUserAccount()}, successFunc);
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
      if (item.aar033 == '0' || item.aar033 == '20' || item.aar033 == '40')
        return;
      // if (item.aar033 == '40') {
      //
      // }
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
  }

//  ////////////////////////////////////第二个树的操作
  initTreeSec(role_id: string): void {

    let successFunc1: any = (response => {
      debugger;
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);

      this.alreadyRoles = this.makeTree(res);
      this.alreadyRoles[0].expanded = true;
    });
    let data = {role_id: role_id};
    if (this.loginService.getUserAccount().match("^99[0-9]{0}admin")) {
      this.conService.queryAlreadyAuthority_sheng(data, successFunc1);
    } else if (this.loginService.getUserAccount().match("^99[0-9]{2}admin")) {
      this.conService.queryAlreadyAuthority_xian(data, successFunc1);
    } else if (this.loginService.getUserAccount().match("^99[0-9]{4}admin")) {
      this.conService.queryAlreadyAuthority_cun(data, successFunc1);
    }


  }

  addNodeToTree(tree: TreeNode[], curNode: TreeNode): void {
    for (let i in tree) {
      if (tree[i].data.aar001 == curNode.data.aaa113) {
        tree[i].children.push(curNode);
        break;
      } else {
        if (tree[i].children) {
          this.addNodeToTree(tree[i].children, curNode);
        }
      }
    }
  }

  nodeExpand2 = ($event) => {
  }
  nodeSelect2 = ($event) => {
  }

  makeTree(res: any[]): TreeNode[] {
    let m_aa11: any = {aar001: '0', aar009: '国扶办', aaa113: '', aar033: '0'};

    let ret: TreeNode[] = [];
    // 设置root菜单
    ret = [
      {
        label: '国扶办', data: {}, expandedIcon: 'fa-folder-open',
        collapsedIcon: 'fa-folder', icon: '', expanded: false, children: []
      },
    ];
    ret[0].data = m_aa11;
    if (res.length > 0) {
      ret[0].children = [];
      for (let i in res) {
        let m_node: TreeNode = {};
        m_node.label = res[i].aar009;
        m_node.data = res[i];
        m_node.children = [];
        m_node.expandedIcon = 'fa-folder-open';
        m_node.collapsedIcon = 'fa-folder';
        m_node.expanded = false;
        if (res[i].aar033 == '70') {
          m_node.icon = "fa-file-image-o";
        } else {
          m_node.icon = "";
        }
        // this.roles[0].children.push(m_node);
        if (res[i].aar033 == '20') {
          ret[0].children.push(m_node);
        } else {
          this.addNodeToTree(ret, m_node);
        }
      }
    }

    return ret;
  }


}
