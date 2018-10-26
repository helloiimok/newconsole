
import {Injectable} from "@angular/core";
import {CustomParam, HttpService} from "../../http/http.service";
import {SystemSetting} from "../../system-setting/system-setting";
import {DialogService} from "../../dialog/dialog.service";
import {CodeName} from "../codename/codename";

@Injectable()
export class DivisionCodeService {

  // 登陆用户的行政区划信息（包括上层行政区划知道Root以及下层行政区划列表）
  private userOrgPathInfo: any;
  private shengDisabled = false;
  private shiDisabled = false;
  private xianDisabled = false;
  private xiangDisabled = false;
  private cunDisabled = false;
  private zuDisabled = false;
  private shengList: CodeName[] = [];
  private shiList: CodeName[] = [];
  private xianList: CodeName[] = [];
  private xiangList: CodeName[] = [];
  private cunList: CodeName[] = [];
  private zuList: CodeName[] = [];

  constructor(private httpService: HttpService,
              public sys: SystemSetting,
              private dialogService: DialogService) {

  }

  initUserUnitInfo(orgUnitInfo: any, userOrgLevel: string) {
    if(!orgUnitInfo){
      return;
    }

    this.userOrgPathInfo = orgUnitInfo;

    switch(userOrgLevel)  {
      case this.sys.UNIT_LEVE_ADMIN:  // Admin
        this.shengList = orgUnitInfo[this.sys.UNIT_LEVE_SHENG];
        break;
      case this.sys.UNIT_LEVE_SHENG:  // 省级用户
        this.shengDisabled = true;
        this.shengList = orgUnitInfo[this.sys.UNIT_LEVE_SHENG];
        this.shiList = orgUnitInfo[this.sys.UNIT_LEVE_SHI];
        break;
      case this.sys.UNIT_LEVE_SHI:    // 市级用户
        this.shengDisabled = true;
        this.shiDisabled = true;
        this.shengList = orgUnitInfo[this.sys.UNIT_LEVE_SHENG];
        this.shiList = orgUnitInfo[this.sys.UNIT_LEVE_SHI];
        this.xianList = orgUnitInfo[this.sys.UNIT_LEVE_XIAN];
        break;
      case this.sys.UNIT_LEVE_XIAN:    // 县级用户
        this.shengDisabled = true;
        this.shiDisabled = true;
        this.xianDisabled = true;
        this.shengList = orgUnitInfo[this.sys.UNIT_LEVE_SHENG];
        this.shiList = orgUnitInfo[this.sys.UNIT_LEVE_SHI];
        this.xianList = orgUnitInfo[this.sys.UNIT_LEVE_XIAN];
        this.xiangList = orgUnitInfo[this.sys.UNIT_LEVE_XIANG];
        break;
      case this.sys.UNIT_LEVE_XIANG:    // 乡级用户
        this.shengDisabled = true;
        this.shiDisabled = true;
        this.xianDisabled = true;
        this.xiangDisabled = true;
        this.shengList = orgUnitInfo[this.sys.UNIT_LEVE_SHENG];
        this.shiList = orgUnitInfo[this.sys.UNIT_LEVE_SHI];
        this.xianList = orgUnitInfo[this.sys.UNIT_LEVE_XIAN];
        this.xiangList = orgUnitInfo[this.sys.UNIT_LEVE_XIANG];
        this.cunList = orgUnitInfo[this.sys.UNIT_LEVE_CUN];
        break;
      case this.sys.UNIT_LEVE_CUN:    // 村用户
        this.shengDisabled = true;
        this.shiDisabled = true;
        this.xianDisabled = true;
        this.xiangDisabled = true;
        this.cunDisabled = true;
        this.shengList = orgUnitInfo[this.sys.UNIT_LEVE_SHENG];
        this.shiList = orgUnitInfo[this.sys.UNIT_LEVE_SHI];
        this.xianList = orgUnitInfo[this.sys.UNIT_LEVE_XIAN];
        this.xiangList = orgUnitInfo[this.sys.UNIT_LEVE_XIANG];
        this.cunList = orgUnitInfo[this.sys.UNIT_LEVE_CUN];
        break;
      case this.sys.UNIT_LEVE_ZU:    // 村用户
        this.shengDisabled = true;
        this.shiDisabled = true;
        this.xianDisabled = true;
        this.xiangDisabled = true;
        this.cunDisabled = true;
        this.zuDisabled = true;
        this.shengList = orgUnitInfo[this.sys.UNIT_LEVE_SHENG];
        this.shiList = orgUnitInfo[this.sys.UNIT_LEVE_SHI];
        this.xianList = orgUnitInfo[this.sys.UNIT_LEVE_XIAN];
        this.xiangList = orgUnitInfo[this.sys.UNIT_LEVE_XIANG];
        this.cunList = orgUnitInfo[this.sys.UNIT_LEVE_CUN];
        this.zuList = orgUnitInfo[this.sys.UNIT_LEVE_ZU];
        break;
    }
  }

  reset(){
    this.shengDisabled = false;
    this.shiDisabled = false;
    this.xianDisabled = false;
    this.xiangDisabled = false;
    this.cunDisabled = false;
    this.zuDisabled = false;
    this.shengList = [];
    this.shiList = [];
    this.xianList = [];
    this.xiangList = [];
    this.cunList = [];
    this.zuList = [];
  }


  /**
   * 取得下级行政区划List
   */

  getSubDivisionList(code: any, divisionFunc: any){
    this.getDivisionList(code, null, ['2'], divisionFunc);
  }

  /**
   * 查询贫困村
   * @param code
   * @param param
   * @param divisionFunc
   */
  getPoorVillage(code: any, param: string, divisionFunc: any) {
    // 成功回调
    let successFunc = (response => {
      // 异常处理
      if(response.options && response.options.code && response.options.code != 1){
        this.dialogService.error(response.options.errorMsg);
        return ;
      }
      divisionFunc(response);
    });

    // 查询时初始化参数
    let queryParam = new CustomParam(true);
    // 此处设定执行后台方法的任意参数

    queryParam['code'] = code;
    queryParam['villageAttributes'] = param? param: '';

    this.httpService.doPost('codelist/queryPoorVillage', queryParam, successFunc);
  }

  private getDivisionList(code: any, level: any,  scope: any, divisionFunc: any){
    // 成功回调
    let successFunc = (response => {
      // 异常处理
      if(response.options && response.options.code && response.options.code != 1){
        this.dialogService.error(response.options.errorMsg);
        return ;
      }
      divisionFunc(response);
    });

    // 查询时初始化参数
    let queryParam = new CustomParam(true);
    // 此处设定执行后台方法的任意参数

    queryParam['code'] = code;
    queryParam['level'] = level;
    queryParam['scopes'] = scope? scope.toString(): '';

    this.httpService.doPost('codelist/getAA11', queryParam, successFunc);
  }

  getCurrentCodeInfo(code: string, successFunc){
    this.getDivisionList(code, null, ['1', '2', '30'], successFunc);
  }

  isShengDisabled(){
    return this.shengDisabled;
  }
  isShiDisabled(){
    return this.shiDisabled;
  }
  isXianDisabled(){
    return this.xianDisabled;
  }
  isXiangDisabled(){
    return this.xiangDisabled;
  }
  isCunDisabled(){
    return this.cunDisabled;
  }
  isZuDisabled(){
    return this.zuDisabled;
  }
  getShengList(){
    return this.shengList;
  }
  getShiList(){
    return this.shiList;
  }
  getXianList(){
    return this.xianList;
  }
  getXiangList(){
    return this.xiangList;
  }
  getCunList(){
    return this.cunList;
  }
  getZuList(){
    return this.zuList;
  }

  createNullCodeName(): CodeName[]{
    return [new CodeName(null, this.sys.CODENAME_NULL_LABEL)];
  }
}
