import {Component, OnInit} from '@angular/core';
import {TreeNode} from "primeng/primeng";
import {ConsoleService} from "../service/console.service";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {LoginService} from "../../../platform/main/login/login.service";
import {ConsoleRoleService} from "../service/console.role.service";
import {ConsoleArraryoperService} from "../service/console.arraryoper.service";

@Component({
  selector: 'app-provbath',
  templateUrl: './provbath.component.html',
  styleUrls: ['./provbath.component.css']
})
export class ProvbathComponent implements OnInit {
  menus: TreeNode[];
  selectedMenus: TreeNode[] = [];
  changeArray: any[] = [];
  changeArray_del: any[] = [];
  selectedValues: string[] = [];

  constructor(private consoleRoleService: ConsoleRoleService,
              private  conService: ConsoleService,
              private  loginService: LoginService,
              private dialogService: DialogService,
              private nodeService: ConsoleArraryoperService,
              private consoleArraryoperService: ConsoleArraryoperService,) {
  }

  ngOnInit() {
    this.initMenu(this.loginService.getUnitCode());
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
    this.conService.queryMenuGfb({
      admin_role_id: this.loginService.getUnitCode(),
      busi_role_id: roleid
    }, successFunc);
  }
  nodeExpand = ($event) => {
    debugger;


  }

  nodeSelect = (event) => {

  }
  nodeUnSelect = (event) => {

  }
  saveMenu = () => {
    debugger;
    let m = this.selectedValues;
    let flg_sheng: string = '0';
    let flg_shi: string = '0';
    let flg_xian: string = '0';
    let flg_xiang: string = '0';
    let flg_cun: string = '0';
    if (this.selectedValues.length == 0) {
      this.dialogService.info('没有选择批量选项，请检查！');
      return;
    }
    for (let i in this.selectedValues) {
      if (this.selectedValues[i] == "f_sheng") {
        flg_sheng = '1';
      }
      if (this.selectedValues[i] == "f_shi") {
        flg_shi = '1';
      }
      if (this.selectedValues[i] == "f_xian") {
        flg_xian = '1';
      }
      if (this.selectedValues[i] == "f_xiang") {
        flg_xiang = '1';
      }
      if (this.selectedValues[i] == "f_cun") {
        flg_cun = '1';
      }
    }
    this.changeArray = [];
    this.changeArray_del = [];
    for (let i in this.selectedMenus) {
      const m_item = this.selectedMenus[i].data;
      this.changeArray.push(m_item);

    }
    const data = {
      options: {opt: 'modifydata'},
      changeData: this.changeArray,
      unitCode: this.loginService.getUnitCode(),
      prm_sheng_batch: flg_sheng,
      prm_shi_batch: flg_shi,
      prm_xian_batch: flg_xian,
      prm_xiang_batch: flg_xiang,
      prm_cun_batch: flg_cun,
      prm_role_type: 'busiRole',
      oper: 'add'
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
      // let res = response.resultList;
      // this.busiRoles = this.conService.transToLowerKeyArray(res);
      this.dialogService.success('保存成功');
      // this.displayDialog = false;
    });
    this.conService.saveMenuBatch(data, successFunc);
  }


  delMenu = () => {
    debugger;
    let m = this.selectedValues;
    let flg_sheng: string = '0';
    let flg_shi: string = '0';
    let flg_xian: string = '0';
    let flg_xiang: string = '0';
    let flg_cun: string = '0';
    if (this.selectedValues.length == 0) {
      this.dialogService.info('没有选择批量选项，请检查！');
      return;
    }
    for (let i in this.selectedValues) {
      if (this.selectedValues[i] == "f_sheng") {
        flg_sheng = '1';
      }
      if (this.selectedValues[i] == "f_shi") {
        flg_shi = '1';
      }
      if (this.selectedValues[i] == "f_xian") {
        flg_xian = '1';
      }
      if (this.selectedValues[i] == "f_xiang") {
        flg_xiang = '1';
      }
      if (this.selectedValues[i] == "f_cun") {
        flg_cun = '1';
      }
    }
    this.changeArray = [];
    for (let i in this.selectedMenus) {
      const m_item = this.selectedMenus[i].data;
      if (this.selectedMenus[i].icon == "fa-file-image-o") {
        this.changeArray.push(m_item);
      }
    }
    const data = {
      options: {opt: 'modifydata'},
      changeData: this.changeArray,
      unitCode: this.loginService.getUnitCode(),
      prm_sheng_batch: flg_sheng,
      prm_shi_batch: flg_shi,
      prm_xian_batch: flg_xian,
      prm_xiang_batch: flg_xiang,
      prm_cun_batch: flg_cun,
      prm_role_type: 'busiRole',
      oper: 'del'
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
      // let res = response.resultList;
      // this.busiRoles = this.conService.transToLowerKeyArray(res);
      this.dialogService.success('保存成功');
      // this.displayDialog = false;
    });
    this.conService.saveMenuBatch(data, successFunc);
  }
}
