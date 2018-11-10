import {Injectable} from '@angular/core';
import {
  CommonQueryParam, CommonSaveParam, HttpService, PageInfo, SingleQueryParam,
  SingleSaveParam
} from "../../../platform/http/http.service";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {SystemSetting} from "../../../platform/system-setting/system-setting";
import {CodeName} from "../../../platform/service/codename/codename";
import {LoginService} from "../../../platform/main/login/login.service";

@Injectable()
export class ConsoleService {


  constructor(private httpService: HttpService,
              private dialogService: DialogService,
              private  loginService: LoginService,
              private sys: SystemSetting) {

  }


  saveMenuBatch = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/saveMenuBatch';
    this.httpService.doPost(baseURL, data, successFun);

  }

  saveMenuAdmin = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/saveMenuAdmin';
    this.httpService.doPost(baseURL, data, successFun);

  }

  /**
   * 函数名称：updateMenu
   * 功能：更新菜单
   * @param data
   * @param successFun
   */
  updateMenu = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/saveMenu';
    this.httpService.doPost(baseURL, data, successFun);

  }
  /**
   * 函数名称：delMenu
   * 功能：删除菜单
   * @param data
   * @param successFun
   */
  delMenu = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/delMenu';
    this.httpService.doPost(baseURL, data, successFun);

  }

  /**
   * 将json对象的key全部转换为小写，适合于提交到后台进行保存
   * @param {Array<any>[]} JsobObj
   * @returns {any[]}
   */
  transToLowerKeyArray(JsobObj: Array<any>[]): any[] {
    const newRows: any[] = new Array<any>();
    for (const item of JsobObj) {
      const ritem: any = {};
      for (const key in item) {
        // this.dialogService.info(item[key]);
        ritem[key.toLowerCase()] = item[key];
      }
      newRows.push(ritem);
    }
    return newRows;
  }

  /**
   * 查询登录账号所能查到的行政区划，基本上都是以省开始的
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryLoginDistrict(data: any, successFunc?: any, pageInfo?: PageInfo): void {
    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAa11ByLogin', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  /**
   * queryUserTest 测试查询功能
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryUserTest(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectMenu', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  /**
   * 功能：查询admin账号（国办的权限）所属的菜单，这个账号说拥有的是全部菜单
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryAdminUserMenu(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectMenuByadmin', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }


  /**
   * 功能：查询各省的角色
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryProvsRole(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    const parm = new CommonQueryParam();
    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectProvRole', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  /**
   * 功能：查询各省的adminrole里是否有指定的菜单权限
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryProvsRoleByMenuID(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    const parm = new CommonQueryParam();
    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectProvRoleByMenuID', data, pageInfo);
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  /**
   * 查询行政区划到县
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryAa11County(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAa11County', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }


  /**
   * 片区的查询，需要查询国扶办付给片区的权限，片区在此基础上进行授权管理
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryAa11Sheng(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAa11Console_sheng', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  /**
   * 国扶办登录管理控制塔查询的权限
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryAa11Gfb(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAa11ConsoleGfb', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }


  /**
   * 片区的查询，需要查询国扶办付给片区的权限，片区在此基础上进行授权管理
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryAa11Xian(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAa11Console_xian', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  queryAa11(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAa11Console', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }


  /**
   * 功能：查询业务角色信息，通过点选经办机构编码
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryBusiRoleByUnitID(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectBusiRoleByUser', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);


    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }


  queryMenuByAdminRoleID(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAdminRoleMenu', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  queryMenuGfb(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();

    const singlparm1_x = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectRoleMenuByRoleID', data, pageInfo);
    const singlparm1_y = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectMenuGfb', data, pageInfo);

    const parm1 = new CommonQueryParam();
    if (this.loginService.getUnitCode() === '000000000000') {
      parm.pushQueryParam('resultList', singlparm1_y);
    } else {
      parm.pushQueryParam('resultList', singlparm1_x);
    }

    // 查询rold_id 对应的账号
    const singlparm2 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAccountByRoleID', data, pageInfo);
    const parm2 = new CommonQueryParam();
    parm.pushQueryParam('accountList', singlparm2);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }


  queryMenuByRoleID(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();

    const singlparm1_x = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectRoleMenuByRoleID', data, pageInfo);
    const singlparm1_y = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectRoleMenuByRoleID_GFB', data, pageInfo);

    const parm1 = new CommonQueryParam();
    if (this.loginService.getUnitCode() == '000000000000') {
      // if(this.sys.isOldConsole & ){
      parm.pushQueryParam('resultList', singlparm1_y);
    } else {
      parm.pushQueryParam('resultList', singlparm1_x);
    }

    // 查询rold_id 对应的账号
    const singlparm2 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAccountByRoleID', data, pageInfo);
    const parm2 = new CommonQueryParam();
    parm.pushQueryParam('accountList', singlparm2);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  /**
   * 移动端控制台（考核评估司）
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryMenuByRoleIDForMobileConsole(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();

    // const singlparm1_x = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectRoleMenuByRoleID', data, pageInfo);
    const singlparm1_y = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectRoleMenuByRoleID_console_mobile', data, pageInfo);

    const parm1 = new CommonQueryParam();
    // if (this.loginService.getUnitCode() == '000000000000') {
    parm.pushQueryParam('resultList', singlparm1_y);
    // } else {
    //   parm.pushQueryParam('resultList', singlparm1_x);
    // }

    // 查询rold_id 对应的账号
    const singlparm2 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAccountByRoleID', data, pageInfo);
    const parm2 = new CommonQueryParam();
    parm.pushQueryParam('accountList', singlparm2);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  queryMenuByRoleIDMobile(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();

    // const singlparm1_x = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectRoleMenuByRoleID', data, pageInfo);
    const singlparm1_y = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectRoleMenuByRoleID_Mobile', data, pageInfo);

    const parm1 = new CommonQueryParam();
    // if (this.loginService.getUnitCode() == '000000000000') {
    parm.pushQueryParam('resultList', singlparm1_y);
    // } else {
    //   parm.pushQueryParam('resultList', singlparm1_x);
    // }

    // 查询rold_id 对应的账号
    const singlparm2 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectAccountByRoleID', data, pageInfo);
    const parm2 = new CommonQueryParam();
    parm.pushQueryParam('accountList', singlparm2);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  getSeq(data: any, successFunc?: any, pageInfo?: PageInfo): void {
    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'sel_pk', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  // 保存权限信息
  saveAuthConsole = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/saveAuth';
    this.httpService.doPost(baseURL, data, successFun);

  }
  // 保存权限信息
  saveAuth = (data: any, successFun?: any) => {
    debugger;
    const baseURL = '/biz/question/saveAudit';
    this.httpService.doPost(baseURL, data, successFun);

  }


  // 保存权限信息
  saveAuthAdmin = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/saveAuthorityAdmin';
    this.httpService.doPost(baseURL, data, successFun);

  }

  // 保存权限信息
  saveAuthBath = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/saveAuthBath';
    this.httpService.doPost(baseURL, data, successFun);

  }

//
  getOptionLabel = (option: CodeName[], value: string): string => {
    for (let i in option) {
      if (option[i].value == value) {
        return option[i].label;
      }
    }
    return '';
  }

  saveUser = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/saveSecRoleUser';
    this.httpService.doPost(baseURL, data, successFun);

  }

  saveRole = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/saveRole';
    this.httpService.doPost(baseURL, data, successFun);

  }

  /**
   * 保存移动端的控制台菜单权限
   * @param data
   * @param successFun
   */
  saveMenuConsolePc = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/saveConsoleMenuForPC';
    this.httpService.doPost(baseURL, data, successFun);

  }


  saveAuthority = (data: any, successFun?: any) => {
    debugger;
    const baseURL = 'console/menu/saveAuthority';
    this.httpService.doPost(baseURL, data, successFun);

  }

  queryAlreadyAuthority_sheng(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_SEC_RESOURCE_AUTHORITYMapper, 'AlreadySelAuth', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  queryAlreadyAuthority_xian(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_SEC_RESOURCE_AUTHORITYMapper, 'AlreadySelAuth_xian', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  queryAlreadyAuthority_cun(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_SEC_RESOURCE_AUTHORITYMapper, 'AlreadySelAuth_cun', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  queryProvs(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_MENUMapper, 'selectProvs', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);
    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  queryUnBindUser(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_ORG_USERMapper, 'selectUnBindUser', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);
    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }


  getRandom(n: number): string {
    let ret: number = 0;
    ret = Math.random() * 10 ^ n;
    if (ret < 1000) {
      ret = 10000 - ret;
    }
    return ret.toString();
  }
}
