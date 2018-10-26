import {Injectable} from "@angular/core";

/**
 * 20180720 jins 新控制台集成SmartBI
 * SmartbiConfigService用户管理Smartbi配置内容，
 * 在点击菜单时，通过key作为唯一标识取得对应的报表的URL用于显示。也可以将配置项转为数据库表的方式存储。
 */
@Injectable()
export class SmartbiConfigService {

  // 也可以将此处配置转为数据库表结构的方式存储
  private smartbiConfig: { [key: string]: SmartbiConfig } = {
    'test0709': {url: 'http://10.1.26.120:18080/smartbi/vision/openresource.jsp?resid=Ie428818a0163917f917f965901647d00825912ab'},
    '2018PersonBasicInfo': {url: 'http://10.1.26.120:18080/smartbi/vision/openresource.jsp?resid=Ie428818a0163917f917f96590163ab4141525a85'}
  }

  public getConfig(key: string): SmartbiConfig {
    return this.smartbiConfig[key];
  }
}

/**
 * 此处也可以将数据存到数据库中，然后通过ID从数据库中查询配置内容。
 * 除了url属性外，还可以添加别的属性。
 */
export class SmartbiConfig {
  url: string;
}
