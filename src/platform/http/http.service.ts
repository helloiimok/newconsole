import {Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Headers, Http, RequestOptions, Response, ResponseContentType} from '@angular/http';
import {DialogService} from '../dialog/dialog.service';
import {StorageService} from "../storage/storage.service";
import {Router} from "@angular/router";
import {MenuService} from "../main/menu/menu.service";
import * as FileSaver from 'file-saver';
import {ExportServerParam} from "../report/report.service";
import {EnvConfigService, UrlInfo} from "../system-setting/env-config.service";

@Injectable()
export class HttpService {

  private urlInfo: UrlInfo;

  private blocked = false;
  private requestCount = 1;
  private requestInfoArray: number[];

  private timeout = 60000;

  private getHeaders() {
    const headers = new Headers();
    const token: string = this.storageService.getToken();
    const currentTab = this.menuService.getCurrentTab();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('token', token);
    headers.append('menuid', currentTab ? currentTab.id : '');
    return headers;
  }

  constructor(private http: Http,
              private router: Router,
              private dialogService: DialogService,
              private storageService: StorageService,
              private menuService: MenuService,
              private envConfig: EnvConfigService) {
    this.requestInfoArray = [];
    this.urlInfo = this.envConfig.getBaseHref();
  }

  getBaseUrl(): string {
    return this.urlInfo.baseHref;
  }

  /**
   * 执行通用查询方法
   *
   * @param condParam
   * @param successFunc
   * @param errorFunc
   */
  doQuery(condParam: CommonQueryParam, successFunc: any, errorFunc?: any): void {
    const requestID = this.registRequestInfo();

    // 如果参数为空，则提示错误信息
    if (!condParam) {
      this.dialogService.error('参数不可以为空。');
      return;
    }

    const param = {
      data: {
        options: {OPT: 'query', type: 'dao'},
        body: condParam.getParamData(),
      },
      success: successFunc,
      error: errorFunc
    };
    // debugger;

    const fullUrl = `${this.urlInfo.baseHref}/common/doQuery`;

    this.http.put(fullUrl, JSON.stringify(param.data), {headers: this.getHeaders()})
    // .timeout(this.timeout)
      .toPromise()
      .then(response => {
        // debugger;
        this.extractData(requestID, response, successFunc, errorFunc);
      })
      .catch((res: Response) => this.handleError(requestID, res));
    // .catch(this.handleError);

  }

  getBlocked() {
    return this.blocked;
  }


  /**
   * 执行通用保存方法
   *
   insert/update/delete
   * @param condParam
   * @param successFunc
   * @param errorFunc
   */
  doSave(condParam: CommonSaveParam, successFunc: any, errorFunc?: any): void {
    const requestID = this.registRequestInfo();

    // 如果参数为空，则提示错误信息
    if (!condParam) {
      this.dialogService.error('参数不可以为空。');
      return;
    }

    const param = {
      data: {
        options: {OPT: 'modifyData'},
        body: condParam.getParamData(),
      },
      success: successFunc,
      error: errorFunc
    };

    const fullUrl = `${this.urlInfo.baseHref}/common/doSave`;

    this.http.put(fullUrl, JSON.stringify(param.data), {headers: this.getHeaders()})
    // .timeout(this.timeout)
      .toPromise()
      .then(response => {
        this.extractData(requestID, response, successFunc, errorFunc);
      })
      .catch((res: Response) => this.handleError(requestID, res));
    // .catch(this.handleError);
  }

  /**
   * 根据指定URL访问后台Service
   *
   * @param path
   * @param data
   * @param successFunc
   */
  doPost(path: string, data: CustomParam, successFunc: any, NotToJson?: boolean) {
    const requestID = this.registRequestInfo();
    const fullUrl = `${this.urlInfo.baseHref}/` + path;

    this.http.post(fullUrl, JSON.stringify(data), {headers: this.getHeaders()})
    // .timeout(this.timeout)
      .toPromise()
      .then(response => {
        this.clearRequestInfo(requestID);
        // 执行后由于没有option.code判断，所以直接调用成功回调函数。
        // 添加系统错误的判断
        // debugger;
        if (response && response.toString().indexOf('options') > 0) {
          const result = response.json();
          if (result.options.code > 400) {
            // 未登陆时提示错误信息，返回登录页
            this.dialogService.error(result.options.errorMsg, (() =>
                this.router.navigate(['/login'])
            ));
            return;
          }
        }
        if (successFunc) {
          if (NotToJson == true) {
            // report不需要JSON处理
            successFunc(response || '');
          } else {
            const body = response.json();
            successFunc(body || {});
          }
        }
      })
      .catch((res: Response) => this.handleError(requestID, res));
  }


  /**
   * 预览处理
   *
   * @param path
   * @param data
   * @param successFunc
   */
  preview(path: string, data: CustomParam, successFunc: any, NotToJson?: boolean) {
    const requestID = this.registRequestInfo();
    const fullUrl = `${this.urlInfo.reportHref}/` + path;

    this.http.post(fullUrl, JSON.stringify(data), {headers: this.getHeaders()})
    // .timeout(this.timeout)
      .toPromise()
      .then(response => {
        this.clearRequestInfo(requestID);
        // 执行后由于没有option.code判断，所以直接调用成功回调函数。
        // 添加系统错误的判断
        if (response && response.toString().indexOf('options') > 0) {
          const result = response.json();
          if (result.options.code > 400) {
            // 未登陆时提示错误信息，返回登录页
            this.dialogService.error(result.options.errorMsg, (() =>
                this.router.navigate(['/login'])
            ));
            return;
          }
        }
        if (successFunc) {
          if (NotToJson == true) {
            // report不需要JSON处理
            successFunc(response || '');
          } else {
            const body = response.json();
            successFunc(body || {});
          }
        }
      })
      .catch((res: Response) => this.handleError(requestID, res));
  }

  download(path: string, data: ExportServerParam, successFunc?: any) {

    const requestID = this.registRequestInfo();
    let options = new RequestOptions({headers: this.getHeaders(), responseType: ResponseContentType.Blob});

    const fullUrl = `${this.urlInfo.reportHref}/` + path;
    return this.http.post(fullUrl, data, options)
    // .timeout(this.timeout)
      .toPromise()
      .then(
        (response: any) => {
          this.clearRequestInfo(requestID);
          // 发生异常时
          if (response._body && response._body.type && response._body.type == 'application/json') {

            this.dialogService.error('文件下载失败。');
            // const body = response.json();
            // 异常处理
            // if (body.options && body.options.code && body.options.code != 1) {
            //   this.dialogService.error(body.options.errorMsg);
            //   return;
            // }
          } else {
            // 成功下载情况下
            let blob: Blob = response.blob();
            let fileName = this.getFileName(response);
            FileSaver.saveAs(blob, decodeURIComponent(fileName));
            if (successFunc) {
              successFunc(response);
            }
          }
        }
      )
      .catch((res: Response) => this.handleError(requestID, res));

  }

  private getFileName(response: any) {
    // debugger;
    if (response) {
      var contentDispositionHeader = response.headers.get('Content-Disposition');
      if (contentDispositionHeader) {
        return contentDispositionHeader.substr(contentDispositionHeader.indexOf('filename=') + 9, contentDispositionHeader.length)
      }
      return null;
    }
  }


  /**
   * 根据指定URL访问后台Service
   *
   * @param data
   * @param successFunc
   * @param errorFunc
   */
  doProc(data: CommonProcParam, successFunc: any, errorFunc: any) {
    const requestID = this.registRequestInfo();
    const fullUrl = `${this.urlInfo.baseHref}/` + 'common/callprocedure';

    this.http.post(fullUrl, JSON.stringify(data), {headers: this.getHeaders()})
    // .timeout(this.timeout)
      .toPromise()
      .then(response => {
        this.extractData(requestID, response, successFunc, errorFunc);
      })
      .catch((res: Response) => this.handleError(requestID, res));
  }

  doLogin(path: string, data: any, successFunc: any, errorFunc: any) {

    // this.storageService.removeToken();
    const requestID = this.registRequestInfo();
    const fullUrl = `${this.urlInfo.baseHref}/` + path;

    this.http.post(fullUrl, JSON.stringify(data), {headers: this.getHeaders()})
    // .timeout(this.timeout)
      .toPromise()
      .then(response => {
        // 取得服务器端token
        this.storageService.setToken(response.headers.get('token'));
        this.extractData(requestID, response, successFunc, errorFunc);
      })
      .catch((res: Response) => this.handleError(requestID, res));
  }

  private extractData(requestID: number, res: Response, successFunc: any, errorFunc: any): void {
    // debugger;
    this.clearRequestInfo(requestID);

    const result = res.json();

    if (result.options.code == 1) {
      if (successFunc) {
        successFunc(result || {});
      }
      // 添加系统异常 -3 的处理
    } else if (result.options.code == -3) {
      this.dialogService.error(result.options.errorMsg);
    } else if (result.options.code > 400) {
      // 未登陆时提示错误信息，返回登录页
      this.dialogService.error(result.options.errorMsg, (() =>
          this.router.navigate(['/login'])
      ));

    } else {
      if (errorFunc) {
        errorFunc(result || {});
      }
    }
  }

  private handleError(requestID: number, error: Response | any) {
    this.clearRequestInfo(requestID);

    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    // return Observable.throw(errMsg);

  }

  /**
   * 新增Request，将ID存储在requestInfoMap中，执行完毕后清除。
   *
   * @returns {number}
   */
  private registRequestInfo(): number {
    this.requestCount++;
    this.requestInfoArray.push(this.requestCount);
    this.blocked = true;
    return this.requestCount;
  }

  /**
   * 取消模板
   * 由于可能同时发起多个请求，所以用数组保存发出的请求，当所有请求都返回时才取消蒙版。
   * 由于JS事件时在主线程线性执行的，所以不会出现多个回调同时操作数组的情况。
   *
   * @param requestID
   */
  private clearRequestInfo(requestID: number) {
    for (let idx in this.requestInfoArray) {
      if (requestID == this.requestInfoArray[idx]) {
        const index = Number(idx);
        this.requestInfoArray.splice(index, 1);
        break;
      }
    }
    if (this.requestInfoArray.length == 0) {
      this.blocked = false;
    }
  }

}


/**
 * 每个SQL查询时需要使用的参数
 */
export class SingleQueryParam {
  conditions: any;
  namespace: string;
  sqlId: string;
  page: PageInfo;

  constructor(namespace: string, sqlId: string, conditions: any, page?: PageInfo) {
    this.conditions = conditions;
    this.namespace = namespace;
    this.sqlId = sqlId;
    this.page = page;
  }
}

/**
 * 每组save/update/delete执行时需要使用的参数信息
 */
export class SingleSaveParam {
  namespace: string;
  sqlId: string;
  classname: string;
  data: any[];

  constructor(namespace: string, sqlId: string, classname: string, data: any[]) {
    this.namespace = namespace;
    this.sqlId = sqlId;
    this.classname = classname;
    this.data = data;
  }
}

/**
 * 每组save/update/delete执行时需要使用的参数信息
 */
export class SingleUpdateParam {
  conditions: any;
  namespace: string;
  sqlId: string;
  classname: string;
  data: any[];

  constructor(namespace: string, sqlId: string, classname: string, conditions: any, data: any[]) {
    this.conditions = conditions;
    this.namespace = namespace;
    this.sqlId = sqlId;
    this.classname = classname;
    this.data = data;
  }
}

/**
 * 每组save/update/delete执行时需要使用的参数信息
 */
export class SingleDeleteParam {
  conditions: any;
  namespace: string;
  sqlId: string;

  constructor(namespace: string, sqlId: string, conditions: any) {
    this.conditions = conditions;
    this.namespace = namespace;
    this.sqlId = sqlId;
  }
}

export class PageInfo {
  pageSize: number;
  startRow: number;
  total?: number; // 服务器端分页查询时使用
}

/**
 * 查询用多组查询参数的数据格式
 */
export class CommonQueryParam {
  private data: { [key: string]: SingleQueryParam };

  constructor() {
    this.data = {};
  }

  pushQueryParam(key: string, param: SingleQueryParam): void {
    this.data[key] = param;
  }

  getParamData() {
    return this.data;
  }
}

export class CommonSaveParam {
  private save: { [key: string]: SingleSaveParam };
  private update: { [key: string]: SingleUpdateParam };
  private delete: { [key: string]: SingleDeleteParam };

  constructor() {
    this.save = {};
    this.update = {};
    this.delete = {};
  }

  pushSaveParam(key: string, param: SingleSaveParam) {
    this.save[key] = param;
  }

  pushUpdateParam(key: string, param: SingleUpdateParam) {
    this.update[key] = param;
  }

  pushDeleteParam(key: string, param: SingleDeleteParam) {
    this.delete[key] = param;
  }

  getParamData() {
    return {
      save: this.save,
      update: this.update,
      delete: this.delete
    };
  }
}


export declare class CommonProcParam {
  namespace: string;
  sqlId: string;
  parameters: any;
}

export class CustomParam {
  // 必须设定
  options: any;

  constructor(isQuery?: boolean) {
    if (isQuery != null) {
      if (isQuery) {
        this.options = {OPT: 'query', type: 'dao'};
      } else {
        this.options = {OPT: 'modifyData'};
      }
    } else {
      this.options = {};
    }
  }
}

