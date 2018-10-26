
import {Injectable} from "@angular/core";
import {CustomParam, HttpService} from "../http/http.service";
import {DialogService} from "../dialog/dialog.service";
import {RequestOptions, ResponseContentType} from "@angular/http";
import {Headers} from '@angular/http';

declare var window: any;

@Injectable()
export class ReportService {

  constructor(private httpService: HttpService,
              private dialogService: DialogService){

  }

  /**
   * 预览
   *
   * @param reportID
   * @param data
   */
  preview(reportID: string, data: any) {

          // 如果需要自定义options参数的话,格式任意
          let otherParam = new CustomParam();
          otherParam.options = {opt: 'print'};
          otherParam['reportId'] = reportID;
          otherParam['data'] = data;

          // 成功回调
          let successFunc = (response => {
            // 发生异常时
            if(response._body && response._body.indexOf('<html') < 0) {
              const body = response.json();
              // 异常处理
              if (body.options && body.options.code && body.options.code != 1) {
                this.dialogService.error(body.options.errorMsg);
                return;
              }
            } else {
              // 成功下载情况下
              const htmlBody = response._body;

              if(htmlBody){
                let previewHtml = htmlBody.replace('</html>', '<script type="text/javascript">window.onload = function() {window.print();window.close();}</script></html>')
                // let newWindow = window.open("data:text/html," + encodeURIComponent(previewHtml), "_blank");
                const newWindow = window.open('','width=auto,height=auto')
                newWindow.document.write(previewHtml)

                newWindow.focus();
                newWindow.print();
                newWindow.close();
        } else {
          this.dialogService.error('打印预览失败。报表ID=' + reportID);
          return;
        }
      }

    });

    this.httpService.preview('report/print', otherParam, successFunc, true);
  }

  download(data: ExportServerParam) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'MyApp-Application' : 'AppName', 'Accept': 'application/xls' });
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });

    this.httpService.download('report/export', data);

  }

}

export class ExportServerParam{
  options: any = {opt: 'export'};
  type: string = "server";
  reportId: string;
  fileName: string;
  conditions: any;
  sqlId: string;
  namespace: string;
  isDecode?: boolean;
  gridHeaderTitles? = new Array<string>();
  gridDataKeys? = new Array<string>();
  reportTitle? = '';
  exportFileType?: 'xls';



  constructor(reportId: string, fileName: string, conditions: any, namespace: string, sqlId: string){
    this.reportId = reportId;
    this.fileName = fileName;
    this.conditions = conditions;
    this.sqlId = sqlId;
    this.namespace = namespace;
  }
}

export class ExportClientParam {
  options: any = {opt: 'export'};
  type: string = "client";
  reportId: string;
  fileName: string;
  data: any;

  constructor(reportId: string, fileName: string, data: any) {
    this.reportId = reportId;
    this.fileName = fileName;
    this.data = data;
  }
}
