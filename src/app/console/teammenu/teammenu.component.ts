import {Component, OnInit} from '@angular/core';
import {ConsoleService} from "../service/console.service";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {LoginService} from "../../../platform/main/login/login.service";
import {ConsoleRoleService} from "../service/console.role.service";
import {ConsoleArraryoperService} from "../service/console.arraryoper.service";
import {TreeNode} from "primeng/primeng";
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  selector: 'app-teammenu',
  templateUrl: './teammenu.component.html',
  styleUrls: ['./teammenu.component.css']
})
export class TeammenuComponent implements OnInit {
  roles: any[] = [];
  teams: any[] = [];
  alreadyRoles: any[] = [];
  selectedRole: any = {};
  menus: TreeNode[];
  selectedMenus: TreeNode[] = [];
  changeArray: any[] = [];

  audit_level: string;
  role_id: string;

  constructor(private consoleRoleService: ConsoleRoleService,
              private  conService: ConsoleService,
              private  loginService: LoginService,
              private dialogService: DialogService,
              private nodeService: ConsoleArraryoperService,
              private consoleArraryoperService: ConsoleArraryoperService,
              private route: ActivatedRoute,) {
    // 此处读取菜单参数

  }

  ngOnInit() {
    debugger;
    // this.queryRoleByCreater(this.loginService.getUserAccount());
    this.selectedMenus = [];
    this.changeArray = [];
    // 根据audit_type 查询相应的菜单
    // 组长、队员 的role_id = mobile_pc_group
    // 队长         role_id = mobile_pc_team
    // 片长         role_id = mobile_pc_district
    // 省         role_id = mobile_pc_prov
    // 国扶办       role_id = mobile_pc_gfb
    this.route.params.subscribe((params: ParamMap) => {
      // console.log('路由入参：' + params['menuParam']);
      debugger;
      this.selectedMenus = [];
      this.changeArray = [];
      const parm = params['menuParam'];
      // this.audit_level = parm['level'];
      let role_id;
      if (parm.indexOf('0') > 0 || parm.indexOf('1') > 0) {
        role_id = 'mobile_pc_group';
      }
      if (parm.indexOf('2') > 0) {
        role_id = 'mobile_pc_team';
      }
      if (parm.indexOf('3') > 0) {
        role_id = 'mobile_pc_district';
      }
      if (parm.indexOf('4') > 0) {
        role_id = 'mobile_pc_prov' ;
      }
      if (parm.indexOf('9') > 0) {
        role_id = 'mobile_pc_gfb';
      }
      this.role_id = role_id;
      this.initMenu(role_id);
    });


  }

  queryMenu = () => {

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

  queryBusiRole = (unitid: string) => {
    let successFunc: any = (response => {
      debugger;
      // 每次刷新树节点，初始化this.changeArray
      this.changeArray = [];
      let res = response.body.resultList.data;
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
    // let admin_role_id:string = roleid;
    this.conService.queryMenuByRoleIDForMobileConsole({
      admin_role_id: this.loginService.getUnitCode(),
      busi_role_id: roleid
    }, successFunc);
  }

  onRowSelect = ($event) => {
    debugger;
    const item = $event.data;
    this.selectedMenus = [];
    this.changeArray = [];
    this.initMenu(item.id);
  }

  onRowUnselect($event) {

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

  saveMenu = () => {
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
      // 保存成功后也需要初始化this.changeArray = [];
      this.changeArray = [];
      let res = response.resultList;
      // this.busiRoles = this.conService.transToLowerKeyArray(res);
      this.dialogService.success('保存成功');
      // this.displayDialog = false;
    });
    const data = {
      options: {opt: 'modifydata'},
      changeData: this.changeArray,
      role_id: this.role_id,
      prm_role_type: 'busiRole',
    };
    this.conService.saveMenuConsolePc(data, successFunc);
  }
}
