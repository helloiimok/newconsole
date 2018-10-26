import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ConsoleService} from "../../../service/console.service";
import {DialogService} from "../../../../../platform/dialog/dialog.service";
import {CarService} from "../../../../demo/service/carservice";
import {LoginService} from "../../../../../platform/main/login/login.service";
import {ConsoleRoleService} from "../../../service/console.role.service";

@Component({
  selector: 'app-userdialog',
  templateUrl: './userdialog.component.html',
  styleUrls: ['./userdialog.component.css']
})
export class UserdialogComponent implements OnInit {

  users: any[] = [];

  totalRecords: number;

  unit_id: string;
  role_id: string;
  selectedUsers: any[] = [];

  @Output() onClose = new EventEmitter<any>();

  constructor(private carService: CarService,
              private conService: ConsoleService,
              private dialogService: DialogService,
              private loginService: LoginService,
              private consoleRoleService: ConsoleRoleService) {
  }

  ngOnInit() {

    this.getUser();
  }


  getUser = () => {
    debugger;
    let successFunc1: any = (response => {
      debugger;
      let res = response.body.resultList.data;
      this.users = this.conService.transToLowerKeyArray(res);
      this.totalRecords = res.length;
    });
    this.conService.queryUnBindUser({unit_id: this.unit_id,}, successFunc1);
  }


  loadCarsLazy = (event) => {

  }

  save = () => {
    const successFunc = (response => {
      debugger;
      if (response.error) {
        const list = response.error;
        this.dialogService.info(list.detail);
        return;
      }
      if (response.options.code !== 1) {
        this.dialogService.error('保存错误: ' + response.options.errorMsg);
        return;
      }
      // 保存成功后也需要初始化this.changeArray = [];
      // this.changeArray = [];
      this.onClose.emit();
      this.dialogService.success('保存成功');
    });
    debugger;
    const data = {
      options: {opt: 'modifydata'},
      changeData: this.selectedUsers,
      role_id: this.role_id,
      opt: 'add',
    };
    this.consoleRoleService.saveRoleUnBindUsers(data, successFunc);
  }
}
