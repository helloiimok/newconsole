import {Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output} from '@angular/core';
import { FormGroup} from '@angular/forms';

import {CodeName} from "../../../service/codename/codename";
import {CodeNameService} from "../../../service/codename/codename.service";

@Component({
  selector: 'nui-multi-select',
template: `
        <div *ngIf="signupForm" [formGroup]="signupForm">
          <p-multiSelect [options]="codeNameList" id="{{id}}" formControlName="{{formControlName}}" [defaultLabel]="nullLabel? nullLabel: '全选'" 
                  [autoWidth]="false" tooltipPosition="top" (onChange)="onChangeExd($event)">
          </p-multiSelect>
        </div>
        <div *ngIf="!signupForm" >
          <p-multiSelect [options]="codeNameList" id="{{id}}" defaultLabel="请选择" 
                  [autoWidth]="false" tooltipPosition="top" (onChange)="onChangeExd($event)">
          </p-multiSelect>
        </div>
        `,
  styleUrls: []
})

export class NuiMultiSelectComponent implements OnInit, OnChanges  {

  // 二级代码类型
  @Input()
  public codetype: string;

  @Input('controlname')
  public formControlName: string;

  @Input()
  public id:string = "";

  @Input('group')
  public signupForm: FormGroup;

  @Input('codeName')
  public codeName: CodeName[];

  @Input('nullLabel')
  public nullLabel: string;

  @Output()
  public change = new EventEmitter();

  codeNameList: CodeName[];

  constructor(private codeNameService: CodeNameService) {

  }

  ngOnInit() {
    // 如果没有设置数组数据，则使用codetype进行查询
    if(!this.codeName){
      this.codeNameList = this.codeNameService.getCodename(this.codetype);
    } else {
      this.codeNameList = this.codeName;
    }

  }

  /**
   * 当Input参数发生了变化时，使用新的入参进行赋值
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if(propName == 'codeName'){
        // 此处必须重新设定下拉列表内容，否则页面上无法显示。不过PrimeNG原生的标签此处不设定也可以。
        this.codeNameList = (changes['codeName']).currentValue;
      }
    }
  }

  /**
   * 封装标签内的onChange事件
   * @param $event
   */
  onChangeExd($event){
    if($event){
      let selectEvent = new SelectEventComponent(this.id, $event.value);
      // 如果设定了onChange事件，就执行
      if(this.change){
        this.change.emit(selectEvent);
      }
    }
  }

}

export class SelectEventComponent{
  id: string;
  // oldValue: string;
  newValue: string;

  constructor(id: string, newValue: string){
    this.id = id;
    // this.oldValue = oldValue;
    this.newValue = newValue;
  }
}
