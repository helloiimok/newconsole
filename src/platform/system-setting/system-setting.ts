import {Injectable} from '@angular/core';
import {CodeName} from '../service/codename/codename';

@Injectable()
export class SystemSetting {
  // 分页每页显示件数 选项数组
  public rowsPerPageOptions = [30, 50, 100];

  // 默认每页显示多少行
  public defaultPageSize = 30;

  // 显示几个页码
  public defaultPageLinks = 1;

  // 分页第一页的Page参数
  public firstPageParam = {pageSize: 30, startRow: 0};

  // 没有数据时显示的信息
  public defaultNoRecordMessage = '没有数据。';

  // 日期控件默认数据类型
  public static defaultDateFormatWithYear = 'YYYY';
  // 日期控件默认数据类型
  public static defaultDateFormatWithMonth = 'YYYYMM';
  // 日期控件默认数据类型
  public static defaultDateFormat = 'YYYYMMDD';
  // 日期控件默认数据类型
  public static defaultDateFormatWithTime = 'YYYYMMDDHHmmss';

  // Html5缓存：前后台交互用Token对应的Key
  public KEY_TOKEN = 'token';

  // Html5缓存：二级代码对应的最后更新时间 Key
  public KEY_CODENAME_UPDATE_DATE = 'codename_update_date';

  // Html5缓存：二级代码对应的Key
  public KEY_CODENAME = 'codename_list';

  // 行政区划根节点
  public ROOT_UNIT_CODE = '0000000000';

  // 行政区划Level
  public UNIT_LEVE_ADMIN = '0';
  public UNIT_LEVE_SHENG = '20';
  public UNIT_LEVE_SHI = '40';
  public UNIT_LEVE_XIAN = '50';
  public UNIT_LEVE_XIANG = '60';
  public UNIT_LEVE_CUN = '70';
  public UNIT_LEVE_ZU = '80';

  // 空二级代码
  public CODENAME_NULL_LABEL = '全选';

  public YESORNO = [new CodeName(null, '全选'), new CodeName('1', '是'), new CodeName('0', '否')];

  // 行政区划ViewMode
  public DIVISION_VIEW_MODE_DEFAULT = '1';
  public DIVISION_VIEW_MODE_FOUR_IN_LINE = '2';
  public DIVISION_VIEW_MODE_FIVE_IN_LINE = '3';
  public DIVISION_VIEW_MODE_THREE_IN_LINE = '4';
  public DIVISION_VIEW_MODE_DEFAULT_WITH_MOVE = '5';
  public DIVISION_VIEW_MODE_FIVE_IN_LINE_NO_LABEL = '6';
  public DIVISION_VIEW_MODE_THREE_IN_LINE_FIN = '7';
  public DIVISION_VIEW_MODE_THREE_IN_LINE_STA = '8';
  public DIVISION_VIEW_MODE_THREE_IN_LINE_NO_COUNTY = '9';
  public DIVISION_VIEW_MODE_FIVE_IN_LINE_BG = '10';
  public DIVISION_VIEW_MODE_THREE_IN_LINE_NO_COUNTY_BG = '11';
  public DIVISION_VIEW_MODE_PROJECT_IMPLEMENT = '12';
  // 开发环境

  public static baseURL = 'http://localhost:8080/cpad_khpgs/api';

  // public static baseURL = 'http://localhost:8088/cpad_khpgs/api';

  public isDebug = false;

  //  启用原来的console管理
  public isOldConsole = false;
  // public isOldConsole = true;
//   系统后台切换，packagebase变更

  public static packageBase = 'com.neusoft.main.core.db.mybatis.mapper';
  public static mapper_UP_MENUMapper = SystemSetting.packageBase + '.UP_MENUMapper';
  public static mapper_UP_SEC_BUSI_ROLEMapper = SystemSetting.packageBase + '.UP_SEC_BUSI_ROLEMapper';
  public static mapper_UP_ORG_USERMapper = SystemSetting.packageBase + '.UP_ORG_USERMapper';
  public static mapper_UP_SEC_BUSI_ROLE_USERMapper = SystemSetting.packageBase + '.UP_SEC_BUSI_ROLE_USERMapper';
  public static mapper_UP_SEC_RESOURCE_AUTHORITYMapper = SystemSetting.packageBase + '.UP_SEC_RESOURCE_AUTHORITYMapper';
  public static mapper_UP_ORG_UNIT_USERMapper = SystemSetting.packageBase + '.UP_ORG_UNIT_USERMapper';
  public static mapper_Da01Mapper = SystemSetting.packageBase + '.Da01Mapper';

}
