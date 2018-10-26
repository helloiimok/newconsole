import {Injectable} from '@angular/core';
import {CommonQueryParam, HttpService, PageInfo, SingleQueryParam} from '../../../../platform/http/http.service';
import {SystemSetting} from '../../../../platform/system-setting/system-setting';
import {DialogService} from '../../../../platform/dialog/dialog.service';
import {Car} from "../../../demo/domain/car";



@Injectable()
export  class TestService {
  constructor(private httpService: HttpService,
              private dialogService: DialogService,
              public sysSetting: SystemSetting,
  ) {

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

    const singlparm1 = new SingleQueryParam(SystemSetting.mapper_UP_ORG_USERMapper, 'selectMenu', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm1);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }



  // 从mysql查询数据
  // 卫计委的接口表查询
  queryMysqlTables(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    // const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    // parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table_distinct', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList1', singlparm1);

    const singlparm2 = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_xt_table_distinct', data, pageInfo);
    const parm2 = new CommonQueryParam();
    parm.pushQueryParam('resultList2', singlparm2);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  queryMysqlTablesList(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_wjw_table', data, pageInfo);
    const parm = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm);

    const singlparm1 = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_xt_table_list', data, pageInfo);
    const parm1 = new CommonQueryParam();
    parm.pushQueryParam('resultList_xt', singlparm1);

    // const singlparm2 = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_xt_table_distinct', data, pageInfo);
    // const parm2 = new CommonQueryParam();
    // parm.pushQueryParam('resultList2', singlparm2);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }



  queryTabCols(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_xt_table_column', data, pageInfo);
    const parm = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  queryXTTabList(data: any, successFunc?: any, pageInfo?: PageInfo): void {

    debugger;
    // 给GRID分页 传查询条件参数
    // this.resultGrid.searchCond = this.queryParam;
    const singlparm = new SingleQueryParam('com.neusoft.biz.core.mapper.ConfigMapper', 'query_xt_table_list', data, pageInfo);
    const parm = new CommonQueryParam();
    parm.pushQueryParam('resultList', singlparm);

    const errorFunc = (
      response => {
        this.dialogService.error(response.options.errorMsg);
      }
    );
    this.httpService.doQuery(parm, successFunc, errorFunc);
  }

  /**
   * 新识别保存
   * @param data 保存数据
   * @param successFunc 成功回调
   */
  saveConfigList(data: any, successFunc?: any): void {
    debugger;
    const baseURL = 'coop/config/saveConfigList';
    this.httpService.doPost(baseURL, data, successFunc);
  }
}
