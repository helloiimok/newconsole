import {Component, OnInit} from '@angular/core';
import {ConsoleRoleService} from "../service/console.role.service";
import {ConsoleService} from "../service/console.service";
import {LoginService} from "../../../platform/main/login/login.service";
import {CodeName} from "../../../platform/service/codename/codename";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  selector: 'app-teamrolemanage',
  templateUrl: './teamrolemanage.component.html',
  styleUrls: ['./teamrolemanage.component.css']
})
export class TeamrolemanageComponent implements OnInit {

  roles: any[] = [];
  selectedRole: any = {};
  users: any[] = [];
  selectUsers: any = [];

  // 二级代码
  sexs: any[];
  opts: any[];

  constructor(private consoleRoleService: ConsoleRoleService,
              private  conService: ConsoleService,
              private  loginService: LoginService,
              private dialogService: DialogService,
              private route: ActivatedRoute) {

    this.sexs = [
      new CodeName('', '请选择'),
      new CodeName('1', '男'),
      new CodeName('2', '女'),
      new CodeName('9', '其他'),
    ];
    // if(this.loginService.getUserAccount().indexOf('ddjc') > 0 ){
    //
    // }else{
    //
    // }

    debugger;
    // 此处读取菜单参数
    this.route.params.subscribe((params: ParamMap) => {

      // console.log('路由入参：' + params['menuParam']);
      debugger;

      const parm = params['menuParam'];
      const o_parm = JSON.parse(parm);
      const user_type = o_parm.type;
      if (user_type === 'ddjc') {
        this.opts = [
          new CodeName('', '请选择'),
          new CodeName('d00', '国扶办'),
          new CodeName('d10', '编辑公司'),
          new CodeName('d20', '省级操作'),
          new CodeName('d40', '市级操作'),
          new CodeName('d50', '县级操作'),
          new CodeName('d60', '乡级操作'),
          new CodeName('d70', '村级操作'),
        ];
      } else {
        this.opts = [
          new CodeName('', '请选择'),
          new CodeName('0', '组员'),
          new CodeName('1', '组长'),
          new CodeName('2', '队长'),
          new CodeName('3', '片长'),
          new CodeName('4', '国扶办'),
        ];
      }

      // this.audit_level = parm['level'];
      console.log('路由入参：' + params['menuParam']);
    });
  }

  ngOnInit() {
    debugger;
    // 此处读取菜单参数
    //
    // this.route.params.subscribe((params: ParamMap) => {
    //   console.log('路由入参：' + params['menuParam']);
    // });

    this.queryRoleByCreater(this.loginService.getUserAccount());
  }

  /**
   *
   * @param {string} account
   */
  queryRoleByCreater = (account: string) => {
    const successFunc: any = (
      response => {
        // 成功回调
        debugger;
        let res = response.body.resultList.data;
        res = this.conService.transToLowerKeyArray(res);
        this.roles = res;
      });

    this.consoleRoleService.queryRoleByCreaterMobile({create_by: account}, successFunc);
  }

  onRowSelect = (event) => {
    debugger;
    const item = event.data
    this.selectedRole = {};
    this.selectedRole = item;

    if (item.id) {
      this.queryUserByRol(item.id);
    }
  }
  teamUnSelect = (event) => {
    debugger;
    // const item = event.data
    this.selectedRole = null;
    this.users = [];
  }
  queryUserByRol = (role_id: string) => {
    const successFunc: any = (
      response => {
        // 成功回调
        debugger;
        let res = response.body.resultList.data;
        res = this.conService.transToLowerKeyArray(res);
        this.users = res;
      });
    this.consoleRoleService.queryUserByRoleMobile({role_id: role_id}, successFunc);
  }

  // 组新增
  newTeam = () => {
    debugger;
    const m_roles = [...this.roles];
    let i = m_roles.length;
    const role = {
      no: '', id: '', name: '', description: '', flg: ''
    };
    role['opt'] = 'add';
    m_roles.push(role);
    m_roles.forEach(function (value, i) {
      value['no'] = i + 1;
    });
    this.roles = m_roles;
  }

  saveTeam = () => {
    debugger;
    if (this.roles.length == 0) {
      this.dialogService.info('没有选择的数据，无需保存！');
      return;
    }
    for (let i in this.roles) {
      if (this.roles[i].name == '') {
        this.dialogService.info('组名称为必录项，必须填写！');
        return;
      }
    }
    let changeData: any[] = [];
    this.roles.forEach(function (value, i) {
      if (value.opt == 'add') {
        changeData.push(value);
      } else {
        if (value['modify'] && value['modify'] == '1') {
          value['opt'] = 'update';
          changeData.push(value);
        }
      }
    });
    if (changeData.length == 0) {
      this.dialogService.info('没有修改的数据，无需保存！');
      return;
    }
    const data = {
      options: {opt: 'modifydata'},
      changeData: changeData,
      adminRoleId: this.loginService.getUnitCode(),
      type: 'mobile'
    }
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
      // this.queryUserByRol(this.selectedRole.id);
      // this.queryRoleByCreater(this.loginService.getUserAccount());
      let res = response.resultList;
      this.roles = this.conService.transToLowerKeyArray(res);
      this.users = [];
      let userList = response.userList;
      if (userList) {
        this.users = this.conService.transToLowerKeyArray(userList);
      }

      this.dialogService.success('保存成功');

    });
    this.conService.saveRole(data, successFunc);
  }
  delTeam = (team: any) => {
    // 因为需要在delTeam1中传入参数，所以将delTeam1的定义移到delTeam中
    // const delTeam1 = (team: any) => {
    const delTeam1 = (() => {
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
        // this.queryRoleByCreater(this.loginService.getUserAccount());
        let res = response.resultList;
        this.roles = this.conService.transToLowerKeyArray(res);
        this.users = [];
        this.dialogService.success('保存成功');
      });


      debugger;
      let m_roles = [...this.roles];
      if (team['id']) {
        const data = {
          options: {opt: 'modifydata'},
          changeData: [{prm_role_id: team.id, opt: 'del', type: 'mobile'}],

        }
        this.conService.saveRole(data, successFunc);
      } else {
        for (let i: number = 0; i < m_roles.length; i++) {
          if (m_roles[i]['no'] == team.no) {
            m_roles.splice(i, 1);
            break;
          }
        }
        m_roles.forEach(function (value, i) {
          value['no'] = i + 1;
        });
        this.roles = m_roles;
      }
    });
    // 调用时应该传入函数本身，如果带上‘(team)’就变成执行函数了。，
    // this.dialogService.question('确定要删除么？', this.delTeam1(team));
    this.dialogService.question('将删除该组下所有级联账号，确定要删除么？', delTeam1);
  }
  // delTeam1 = (team: any) => {
  //   const successFunc = (response => {
  //     debugger;
  //     if (response.error) {
  //       const list = response.error;
  //       this.dialogService.info(list.detail);
  //       return;
  //     }
  //     if (response.options.code !== 1) {
  //       this.dialogService.error('保存错误: ' + response.options.errorMsg);
  //       return;
  //     }
  //     // this.queryRoleByCreater(this.loginService.getUserAccount());
  //     let res = response.resultList;
  //     this.roles = this.conService.transToLowerKeyArray(res);
  //     this.users = [];
  //     this.dialogService.success('保存成功');
  //   });
  //
  //
  //   debugger;
  //   let m_roles = [...this.roles];
  //   if (team['id']) {
  //     const data = {
  //       options: {opt: 'modifydata'},
  //       changeData: [{prm_role_id: team.id, opt: 'del', type: 'mobile'}],
  //
  //     }
  //     this.conService.saveRole(data, successFunc);
  //   } else {
  //     for (let i: number = 0; i < m_roles.length; i++) {
  //       if (m_roles[i]['no'] == team.no) {
  //         m_roles.splice(i, 1);
  //         break;
  //       }
  //     }
  //     m_roles.forEach(function (value, i) {
  //       value['no'] = i + 1;
  //     });
  //     this.roles = m_roles;
  //   }
  // }
  //////////////////////////////////////////////////////////

  newUser = () => {
    // this.displayDialog = true;
    debugger;
    if (!this.selectedRole.id) {
      this.dialogService.info('请选择工作组，组员必须加入到工作组中！');
      return;
    }
    debugger;
    const m_users = [...this.users];
    let i = m_users.length;

    const user = {
      account: '', name: '', audit_level: '', password: '', role_id: this.selectedRole.id,
      type: '', mobile_telephone: '', sex: '', account_enabled: 'T', account_locked: 'F'
    };

    user['opt'] = 'add';
    m_users.push(user);
    m_users.forEach(function (value, i) {
      value['no'] = i + 1;
    });
    this.users = m_users;
  }

  handleRowSelect = (event) => {
    const item = event.data;

    item['addlfg'] = '1';
  }
  saveUser = () => {
    debugger;

    if (!this.selectedRole || !this.selectedRole.id) {
      this.dialogService.info('请选择工作组，组员必须加入到工作组中！');
      return;
    }
    if (this.users.length == 0) {
      this.dialogService.info('没有选择的数据，无需保存！');
      return;
    }

    // 检查需要填写的数据，其中必填项必须填写
    for (let i in this.users) {
      if (!this.users[i]['account'] || this.users[i]['account'] == '') {
        this.dialogService.info('账户项必填，请填写！');
        return;
      }
      if (!this.users[i]['name'] || this.users[i]['name'] == '') {
        this.dialogService.info('账户名称必填，请填写！');
        return;
      }
      if (!this.users[i]['password'] || this.users[i]['password'] == '') {
        this.dialogService.info('密码项必填，请填写！');
        return;
      }
      if (!this.users[i]['audit_level'] || this.users[i]['audit_level'] == '') {
        this.dialogService.info('审核级别项必填，请填写！');
        return;
      }
      if (!this.users[i]['mobile_telephone'] || this.users[i]['mobile_telephone'] == '') {
        this.dialogService.info('电话项必填，请填写！');
        return;
      }
    }


    let changeData: any[] = [];
    this.users.forEach(function (value, i) {
      if (value.opt) {
        changeData.push(value);
      } else {
        value['opt'] = 'update';
        changeData.push(value);
      }
    });

    if (changeData.length == 0) {
      this.dialogService.info('保存成功！')
      return;
    }
    const data = {
      options: {opt: 'modifydata'},
      changeData: changeData,
      role_id: this.selectedRole.id
    }
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
      // this.queryUserByRol(this.selectedRole.id);
      let res = response.resultList;
      this.users = this.conService.transToLowerKeyArray(res);
      this.dialogService.success('保存成功');


    });
    this.conService.saveUser(data, successFunc);

  }

  delUser = (user: any) => {
    const delUser1 = (() => {
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
        let res = response.resultList;
        this.users = this.conService.transToLowerKeyArray(res);
        this.dialogService.success('保存成功');
      });


      let m_users = [...this.users];

      if (user['id']) {
        const data = {
          options: {opt: 'modifydata'},
          changeData: [{id: user.id, opt: 'del',}],
          role_id: this.selectedRole.id
        }
        this.conService.saveUser(data, successFunc);
      } else {
        for (let i: number = 0; i < m_users.length; i++) {
          if (this.users[i]['no'] == user.no) {
            m_users.splice(i, 1);
            break;
          }
        }
        m_users.forEach(function (value, i) {
          value['no'] = i + 1;
        });
        this.users = m_users;
      }
    });
    if (user.account.indexOf("admin") > 0) {
      this.dialogService.info('管理员用户，不能通过此功能删除，只能以删除角色的模式删除!');
      return;
    }
    this.dialogService.question('确定要删除么？', delUser1);
  }

  onChangeAccount($event): void {
    debugger;
    const item_data = $event.data;
    const column = $event.column;
    if (column.field != "account" && column.field != "audit_level") {
      return;
    }
    switch (column.field) {
      case "account":
        this.verifyAccDup(item_data.account);
        break;
      case "audit_level":
        let t_users = [...this.users];
        for (let i = 0; i < t_users.length; i++) {
          if (t_users[i].account === item_data.account) {
            t_users[i]['type'] = item_data.audit_level;
            break;
          }
        }
        this.users = t_users;
        break;
      default:
        break;
    }
  }

  /**
   * 校验组名称是否重复
   * @param $event
   */
  onChangeTeam = ($event) => {
    debugger;
    const item_data = $event.data;
    const column = $event.column;
    if (column.field != "name") {
      return;
    }
    $event.data['modify'] = '1'; // 增加修改标志，如果已经存在的记录被修改了，也可以记录
    this.verifyTeamDup(item_data.name);
  }

  //  校验名称是否重复
  verifyAccDup = (account_name: string): void => {
    const successFunc2: any = (response => {
      debugger;
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      if (res[0].cnt > 0) {
        //  重置用户名称
        const user_temp: any[] = [...this.users];
        for (let i = 0; i < user_temp.length; i++) {
          let item = user_temp[i];
          if (item.account === account_name) {
            if (!item.flg) {
              user_temp.splice(i, 1);
              break;
            }
          }
        }
        this.users = user_temp;
        this.dialogService.info("用户名称" + account_name + "与数据库中的已有名称重复，请重新录入!");
      }


    });
    this.consoleRoleService.queryUserDup({account_name: account_name}, successFunc2);
  }

  //  校验名称是否重复
  verifyTeamDup = (account_name: string): void => {
    const successFunc2: any = (response => {
      debugger;
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      if (res[0].cnt > 0) {
        // 删除重复的
        //  重置用户名称
        const role_temp: any[] = [...this.roles];
        for (let i = 0; i < role_temp.length; i++) {
          let item = role_temp[i];
          if (item.name === account_name) {
            if (!item.flg) {
              role_temp.splice(i, 1);
              break;
            }
          }
        }
        this.roles = role_temp;

        this.dialogService.info("组名称" + account_name + "与数据库中的已有名称重复，请重新录入!");
      }
    });
    this.consoleRoleService.queryTeamDup({name: account_name}, successFunc2);
  }
}
