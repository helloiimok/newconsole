import {Component, OnInit} from '@angular/core';
import {TreeNode} from "primeng/primeng";
import {ConsoleService} from "../service/console.service";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {ConsoleRoleService} from "../service/console.role.service";
import {ConsoleArraryoperService} from "../service/console.arraryoper.service";
import {LoginService} from "../../../platform/main/login/login.service";

@Component({
  selector: 'app-usermanage',
  templateUrl: './usermanage.component.html',
  styleUrls: ['./usermanage.component.css']
})
export class UsermanageComponent implements OnInit {
  roles: TreeNode[];
  selRoles: TreeNode;
  roleUsers: any[] = [];


  constructor(
    private conService: ConsoleService,
    private dialogService: DialogService,
    private consoleArraryoperService: ConsoleArraryoperService,
    private loginService: LoginService,
    private consoleRoleService: ConsoleRoleService) {
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

    this.queryUnitUser(item.aar001);
    //
    // this.menus = [];
    // this.roleUsers = [];
    // this.queryBusiRole(item.aar001);
  }

  queryUnitUser = (unit_id: string) => {
    debugger;
    let successFunc: any = (response => {
      debugger;
      let res = response.body.resultList.data;
      this.roleUsers = this.conService.transToLowerKeyArray(res);
    });
    let data = {unit_id: unit_id};
    this.consoleRoleService.queryUnitUser(data, successFunc);
  }

  addUser = () => {
    debugger;
    if (!this.selRoles) {
      this.dialogService.info('请先选择行政经办机构!');
      return;
    }
    let m_users = [...this.roleUsers];
    let len = m_users.length + 1;
    let o_user = {no: len, account: '', name: '', flg: '0', id: '0', password: '111111', opt: 'add'};
    m_users.push(o_user);
    this.roleUsers = m_users;

  }
  saveUser = () => {

    debugger;
    const successFunc = (response => {
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

      this.dialogService.success('保存成功');
    });

    const m_user = [...this.roleUsers];
    let changDate: any[] = [];
    m_user.forEach(function (value, index) {
      if (value.flg == '0' || value['opt'] == 'update') {
        changDate.push(value);
      }
    });

    const data = {
      options: {opt: 'modifydata'},
      changeData: changDate,
      unit_id: this.selRoles.data.aar001,
    };

    this.consoleRoleService.saveUnitUsers(data, successFunc);
  }

  editChange = ($event) => {
    debugger;
    const item = $event.data;
    let m_user = [...this.roleUsers];
    if (item.flg == '1') {
      m_user[$event.index]['opt'] = 'update';
    }

    this.roleUsers = m_user;
  }

  delBindUser = (user: any) => {
    debugger;
    const successFunc = (response => {
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

      let m_user = [...this.roleUsers];
      let index: number = 0;
      for (let i = 0; i < m_user.length; i++) {
        if (m_user[i].id == user.id) {
          index = i;
          break;
        }
      }
      m_user.splice(index, 1);
      this.roleUsers = m_user;
      this.dialogService.success('保存成功');
    });
    let changDate: any[] = [];
    if (user.flg == '0') {
      let m_user = [...this.roleUsers];
      let index: number = 0;
      for (let i = 0; i < m_user.length; i++) {
        if (m_user[i].id == user.id) {
          index = i;
          break;
        }
      }
      m_user.splice(index, 1);
      this.roleUsers = m_user;
    } else {
      user['opt'] = 'del';
      changDate.push(user);
      const data = {
        options: {opt: 'modifydata'},
        changeData: changDate,
        unit_id: this.selRoles.data.aar001,
      };
      this.consoleRoleService.saveUnitUsers(data, successFunc);
    }
  }
}
