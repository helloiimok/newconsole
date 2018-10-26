import { Injectable } from '@angular/core';
import {CommonQueryParam, HttpService, PageInfo, SingleQueryParam} from "../../../platform/http/http.service";
import {DialogService} from "../../../platform/dialog/dialog.service";
import {SystemSetting} from "../../../platform/system-setting/system-setting";

@Injectable()
export class ConsoleRoleService {

  constructor(private httpService: HttpService,
              private dialogService: DialogService,) {
  }


  /**
   * queryRoleByCreater 根据登录用户进行角色的查询
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryRoleByCreater(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_SEC_BUSI_ROLEMapper, 'selectByCreater', data, pageInfo);
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
   * queryRoleByCreater 根据登录用户进行角色的查询
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryRoleByCreaterMobile(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_SEC_BUSI_ROLEMapper, 'selectByCreater_mobile', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  queryUserByRole(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_ORG_USERMapper, 'selectUserByRole', data, pageInfo);
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
   * 移动端控制台组查询
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  queryUserByRoleMobile(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_ORG_USERMapper, 'selectUserByRoleMobile', data, pageInfo);
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
   * 保存用户到指定的组中去
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  saveRoleUsers(data: any, successFunc?: any, pageInfo?: PageInfo): void {
    debugger;
    const baseURL = 'console/menu/saveSecRoleUser';
    this.httpService.doPost(baseURL, data, successFunc);
  }

  /**
   * 将游离的用户，没有绑定到任何角色的用户，重新绑定到role上
   * @param data
   * @param successFunc
   * @param {PageInfo} pageInfo
   */
  saveRoleUnBindUsers(data: any, successFunc?: any, pageInfo?: PageInfo): void {
    debugger;
    const baseURL = 'console/menu/saveRoleUser';
    this.httpService.doPost(baseURL, data, successFunc);
  }

  delBindUsers(data: any, successFunc?: any, pageInfo?: PageInfo): void {
    debugger;
    const baseURL = 'console/menu/del';
    this.httpService.doPost(baseURL, data, successFunc);
  }


  queryUserDup(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_ORG_USERMapper, 'selectByAccount', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);

  }

  queryTeamDup(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_SEC_BUSI_ROLEMapper, 'selectCountByName', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);

  }

  queryUnitUser(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_ORG_USERMapper, 'selectByUnitId', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);

  }

  saveUnitUsers(data: any, successFunc?: any, pageInfo?: PageInfo): void {
    debugger;
    const baseURL = 'console/menu/saveUnitUser';
    this.httpService.doPost(baseURL, data, successFunc);
  }

  queryDa01(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_Da01Mapper, 'selectAllNew', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);

  }

}
