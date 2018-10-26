import { Injectable } from '@angular/core';
import { CodeName } from './codename';
import {CustomParam, HttpService} from '../../http/http.service';
import {DialogService} from '../../dialog/dialog.service';
import {StorageService} from '../../storage/storage.service';

@Injectable()
export class CodeNameService {

  /**
   * 二级代码列表
   */
  private codeNameList: {[key: string]: CodeName[]};

  constructor(private httpService: HttpService,
              private storageService: StorageService,
              private dialogService: DialogService) {
    this.codeNameList = this.storageService.getCodeName();
  }

  /**
   * 加载二级代码
   */
  loadCodeName(){
    // 成功回调
    const successFunc = (response => {
      // 异常处理
      if (response.options && response.options.code && response.options.code != 1){
        this.dialogService.error(response.options.errorMsg);
        return;
      }

      // console.log('本次更新的二级代码如下');
      // console.log(response.data);
      this.mergeCodeNameList(response.data);

      // 将合并后的内容更新到H5缓存，同时记录更新时间
      this.storageService.setCodeName(this.codeNameList);
      this.storageService.setCodeNameUpdateDate(response.timestamp);
    });

    // 查询时初始化参数
    const queryParam = new CustomParam(true);
    // 此处设定执行后台方法的任意参数

    // console.log('本次更新的二级代码的时间戳：' + this.storageService.getCodeNameUpdateDate());
    queryParam['timestamp'] = this.storageService.getCodeNameUpdateDate();
    // console.log(queryParam);

    this.httpService.doPost('codelist/getAA10', queryParam, successFunc);
  }

  /**
   * 使用新的二级代码合并原有的。
   *
   * @param newList
   */
  private mergeCodeNameList(newList: {[key: string]: CodeName[]}){
    if (!this.codeNameList) {
      this.codeNameList = newList;
    } else {
      if (newList) {
        for (const codeType in newList){
          this.codeNameList[codeType] = newList[codeType];
        }
      }
    }
  }

  getCodename(codeType: string): CodeName[]{
    const codeName = this.codeNameList[codeType];
    if (codeName) {
      for (const index in codeName){
        if (codeName[index].effective == false) {
          codeName.splice(Number(index), 1);
        }
      }
    }
    return codeName ? codeName : [];
  }

  // getCodenameValue(codeType: string, code: string) {
  //   const codeName = this.codeNameList[codeType];
  //   let label = null;
  //   if(codeName){
  //     for(let index in codeName){
  //       if(index == code) {
  //         label = codeName[index].label;
  //       }
  //     }
  //   }
  //
  //   return label;
  // }
}
