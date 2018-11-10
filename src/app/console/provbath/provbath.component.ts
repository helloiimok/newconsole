import {Component, OnInit} from '@angular/core';
import {Message, SelectItem, TreeNode} from 'primeng/primeng';
import {ConsoleService} from '../service/console.service';
import {DialogService} from '../../../platform/dialog/dialog.service';
import {LoginService} from '../../../platform/main/login/login.service';
import {ConsoleRoleService} from '../service/console.role.service';


@Component({
  selector: 'app-provbath',
  templateUrl: './provbath.component.html',
  styleUrls: ['./provbath.component.css']
})
export class ProvbathComponent implements OnInit {

  msgs: Message[];
  menus: TreeNode[];
  selectedMenus: TreeNode[] = [];
  changeArray: any[] = [];
  changeArray_del: any[] = [];
  selectedValues: string[] = [];
  //  treeTable 变量
  districtValue: any[];
  selDist: any[];
  file: TreeNode;

  // brands: SelectItem[];
  colors: SelectItem[];
  aar033_opt: SelectItem[];
  // yearFilter: number;

  yearTimeout: any;
  //
  constructor(private consoleRoleService: ConsoleRoleService,
              private  conService: ConsoleService,
              private  loginService: LoginService,
              private dialogService: DialogService,
              ) {
  }

  ngOnInit() {
    debugger;
    // this.districtValue = [
    //   {'vin': 'aa', 'year': '2010', 'brand': 'Audi', 'color': 'White'},
    //   {'vin': 'aa1', 'year': '2011', 'brand': 'BMW', 'color': 'Green'},
    //   {'vin': 'aa2', 'year': '20102', 'brand': 'Fiat', 'color': 'Maroon'},
    // ];

    this.aar033_opt = [];
    this.aar033_opt.push({label: '省级', value: '20'});
    this.aar033_opt.push({label: '市级', value: '40'});
    this.aar033_opt.push({label: '县级', value: '50'});
    this.aar033_opt.push({label: '乡级', value: '60'});

    // this.colors = [];
    // this.colors.push({label: 'White', value: 'White'});
    // this.colors.push({label: 'Green', value: 'Green'});
    // this.colors.push({label: 'Silver', value: 'Silver'});
    // this.colors.push({label: 'Black', value: 'Black'});
    // this.colors.push({label: 'Red', value: 'Red'});
    // this.colors.push({label: 'Maroon', value: 'Maroon'});
    // this.colors.push({label: 'Brown', value: 'Brown'});
    // this.colors.push({label: 'Orange', value: 'Orange'});
    // this.colors.push({label: 'Blue', value: 'Blue'});



    this.initMenu(this.loginService.getUnitCode());
    this.queryDistrict();

  }


  queryDistrict() {
    debugger;
    const successFunc: any = (response => {
      debugger;
      //  显示 角色关联的账号信息
      let res = response.body.resultList.data;
      res = this.conService.transToLowerKeyArray(res);
      this.districtValue = res;
    });
    // 取登录账号的前两位，表示省的编号，在过滤行政区划时候可以使用
    let pre_qh: string;
    if (this.loginService.getUserAccount() !== 'fpbadmin') {
      pre_qh = this.loginService.getUserAccount().substr(0, 2);
    }else {
      pre_qh = '0';
    }

    const  data = {
      pre_qh : pre_qh,
      account: this.loginService.getUserAccount(),
    }
    this.conService.queryLoginDistrict(data, successFunc);
  }

  onYearChange(event, dt, col) {
    if (this.yearTimeout) {
      clearTimeout(this.yearTimeout);
    }

    this.yearTimeout = setTimeout(() => {
      dt.filter(event.value, col.field, col.filterMatchMode);
    }, 250);
  }



  /**
   * 根据roleid初始化菜单
   * @param {string} roleid
   */
  initMenu = (roleid: string) => {
    const successFunc: any = (response => {
      debugger;
      //  显示 角色关联的账号信息
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
        if (nodeMenu['checked'] === 1) {
          selectArray.push(nodeMenu);
        }
        // 判断id和parent_id
        if (value['parentid'] != null && value['parentid'] !== '') {
          menuList.forEach(function (val, i) {
            // 此处只考虑了正序的情况，也就是从根到叶子，如果乱序，那么需要添加else部分的代码，
            // 暂时没有想好，后期可以尝试
            if (val['id'] === value['parentid']) {
              val['children'].push(nodeMenu);
              val['expandedIcon'] = 'fa-folder-open';
              val['collapsedIcon'] = 'fa-folder';
              val['icon'] = '';
            }
            //  返回根节点
            if (val['id'] === 'menuManager') {
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

   saveMenu = (oper ) => {
    debugger;
    if (!this.selectedMenus || this.selectedMenus.length === 0) {
      this.dialogService.info('没选择要授权的菜单，请选择！');
      return;
    }
    if (!this.selDist || this.selDist.length === 0 ) {
      this.dialogService.info('没有选择对应的角色，请选择！');
      return;
    }
    // 获取选中的菜单
    const  m_sel = this.selectedMenus;
    // 获取勾选的行政区划
    const  dist_sel = this.selDist;

    const parm_menu = [];

    for (const i in m_sel) {
      let o_menu = {};
      o_menu['prm_menu_id'] = m_sel[i]['id'];
      o_menu['prm_menu_parent_id'] = m_sel[i]['data']['parentid'];
      parm_menu.push(o_menu);
    }
    let s_busi_role : string;
    if (this.loginService.getUserAccount() === 'fpbadmin'){
      s_busi_role = 'adminRole';
    }else {
      s_busi_role = 'busiRole';
    }
    const data = {
      options: {opt: 'modifydata'},
      menuData: parm_menu,
      distData: dist_sel,
      // changeData: this.changeArray,
      unitCode: this.loginService.getUnitCode(),

      prm_role_type: s_busi_role,
      // oper: 'add'
      oper: oper
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
    if (this.loginService.getUserAccount() === 'fpbadmin') {
      this.conService.saveMenuAdmin(data, successFunc);
    }else {
      this.conService.saveMenuBatch(data, successFunc);
    }
  }


  delMenu = () => {
    debugger;
    // 获取选中的菜单
    const  m_sel = this.selectedMenus;
    // 获取勾选的行政区划
    const  dist_sel = this.selDist;

    const parm_menu = [];

    for (const i in m_sel) {
      let o_menu = {};
      o_menu['prm_menu_id'] = m_sel[i]['id'];
      o_menu['prm_menu_parent_id'] = m_sel[i]['parent']['id'];
      parm_menu.push(o_menu);
    }
    let s_busi_role : string;
    if (this.loginService.getUserAccount() === 'fpbadmin' ){
      s_busi_role = 'adminRole';
    }else{
      s_busi_role = 'busiRole';
    }

    const data = {
      options: {opt: 'modifydata'},
      menuData: parm_menu,
      distData: dist_sel,
      // changeData: this.changeArray,
      unitCode: this.loginService.getUnitCode(),
      prm_role_type: s_busi_role,
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
    if (this.loginService.getUserAccount() === 'fpbadmin'){
      this.conService.saveAuthAdmin(data, successFunc);
    }else {
      this.conService.saveMenuBatch(data, successFunc);
    }
  }

}

