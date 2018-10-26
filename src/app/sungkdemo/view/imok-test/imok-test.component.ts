import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MenuItem, Message, TreeNode} from 'primeng/primeng';
import {NodeService} from '../../../demo/service/nodeservice';
import {CustomParam, HttpService} from "../../../../platform/http/http.service";
import {StorageService} from "../../../../platform/storage/storage.service";
import {DialogService} from "../../../../platform/dialog/dialog.service";
import {TestService} from "./testService";
import {debug} from "util";

@Component({
  selector: 'app-imok-test',
  templateUrl: './imok-test.component.html',
  styleUrls: ['./imok-test.component.css']
})
export class ImokTestComponent implements OnInit, AfterViewInit {
  msgs: Message[];
  files1: TreeNode[];
  files2: TreeNode[];
  files3: any[] = [];
  items: MenuItem[];
  selectedFile2: TreeNode;

  constructor(private nodeService: NodeService,
              private httpService: HttpService,
              private storageService: StorageService,
              private dialogService: DialogService,
              private testService: TestService) {
    this.nodeService.getFilesystem().then(files => this.files1 = files);
    this.nodeService.getFiles().then(files => this.files2 = files);
  }
  private successFunc: any = (
    response => {
      // 成功回调
      debugger;
      // 数据源表的下拉列表赋值
      let res = response.body.resultList.data;
      // this.localForm.patchValue({'ori_list': response.body.resultList1.data});
      // this.configGrid.setTarTableList(response.body.resultList2.data);

    }
  );
  ngOnInit() {

    this.items = [
      {label: 'View', icon: 'fa-search', command: (event) => this.viewFile(this.selectedFile2)},
      {label: 'Unselect', icon: 'fa-close', command: (event) => this.unselectFile()}
    ];

    this.files3.push({'data': 111, 'label': 'test'});
  }

  ngAfterViewInit() {
    // 测试Http请求
    // 成功回调
    const successFunc = (response => {
      // 异常处理
      console.log('查询结果：');
      console.log(response.data);
    });

    // 查询时初始化参数
    const queryParam = new CustomParam(true);
    // 此处设定执行后台方法的任意参数

    // console.log('本次更新的二级代码的时间戳：' + this.storageService.getCodeNameUpdateDate());
    queryParam['timestamp'] = this.storageService.getCodeNameUpdateDate();
    // console.log(queryParam);

    this.httpService.doPost('codelist/getAA10', queryParam, successFunc);
  }

  viewFile(file: TreeNode) {
    debugger;
    this.msgs = [];
    this.files3.push({'data': this.selectedFile2.data, 'label': this.selectedFile2.label});
    this.msgs.push({severity: 'info', summary: 'Node Selected with Right Click', detail: file.label});

  }
  unselectFile() {
    // this.files3.pop({'data': this.selectedFile2});
    this.selectedFile2 = null;
  }



  test = () => {
   // this.dialogService.info('ok');
   debugger;
    this.testService.queryUserTest({},this.successFunc);

  }
}

