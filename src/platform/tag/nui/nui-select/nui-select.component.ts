import {Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output} from '@angular/core';
import { FormGroup} from '@angular/forms';

import {CodeName} from "../../../service/codename/codename";
import {CodeNameService} from "../../../service/codename/codename.service";

@Component({
  selector: 'nui-select',
  template: `
        <div *ngIf="signupForm" [formGroup]="signupForm">
          <p-dropdown [options]="codeNameList" id="{{id}}" name="{{id}}" formControlName="{{formControlName}}" [filter]="filter" [disabled]="disabled"
                  [autoWidth]="false" tooltipPosition="top" (onChange)="onChangeExd($event)" appendTo="body">
          </p-dropdown>
        </div>
        <div *ngIf="!signupForm" >
          <p-dropdown [options]="codeNameList" id="{{id}}" name="{{id}}" [filter]="filter" [disabled]="disabled" [(ngModel)]="model" 
                  [autoWidth]="false" tooltipPosition="top" (onChange)="onChangeExd($event)" appendTo="body">
          </p-dropdown>
        </div>
        `,
  styleUrls: []
})

export class NuiSelectComponent implements OnInit, OnChanges  {

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

  @Input('filter')
  public filter: boolean;

  @Input('contain')
  public contain: string ="";

  @Input('noContain')
  public noContain: string ="";

  @Input('disabled')
  public disabled: boolean;

  @Input('model')
  public model: any;

  @Input('nullLabel')
  public nullLabel: string;

  @Output()
  public change = new EventEmitter();

  private nullCodeName = [new CodeName(null, this.nullLabel? this.nullLabel: '全选')];
  codeNameList: CodeName[];
  constructor(private codeNameService: CodeNameService) {

  }

  ngOnInit() {
    // 如果没有设置数组数据，则使用codetype进行查询
    if(!this.codeName){
      this.codeNameList = this.nullCodeName.concat(this.codeNameService.getCodename(this.codetype));
      this.ngOnfilter();
    } else {
      this.codeNameList = this.codeName;
      this.ngOnfilter();
    }

  }
  ngOnfilter(){
    //如果设置contain属性则只显示contain中包含的数据
    if(this.contain != ""){
      let temp:CodeName[] = [];
      let contains :string[] = this.contain.split(',');
      for(var i = 0 ; i < contains.length ; i++){
        for(var n = 0 ; n < this.codeNameList.length ; n++){
          if(contains[i] == this.codeNameList[n].value){
            // this.codeNameList.splice(n,1);
            temp.push(new CodeName(this.codeNameList[n].value , this.codeNameList[n].label));
            break;
          }
        }
      }
      this.codeNameList=temp;
    }

    //如果设置noContain属性则把noContain中的值从列表中去除
    if(this.noContain != ""){
      let temp:CodeName[] = [];
      for(var i = 0 ; i < this.codeNameList.length ; i++){
        temp.push(new CodeName(this.codeNameList[i].value , this.codeNameList[i].label));
      }
      let noContains :string[] = this.noContain.split(',');
      for(var i = 0 ; i < noContains.length ; i++){
        for(var n = 0 ; n < temp.length ; n++){
          if(noContains[i] == temp[n].value){
            temp.splice(n,1);
            break;
          }
        }
      }
      this.codeNameList=temp;
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
        this.ngOnfilter();
      }else if(propName == 'codetype'){
        //此处codetype发生变化时，重新按新的codetype进行查询 add by 张宏喜  20170615
        this.codeNameList = this.codeNameService.getCodename(this.codetype);
        this.ngOnfilter();
      }
    }
  }

  /**
   * 封装标签内的onChange事件
   * @param $event
   */
  onChangeExd($event){
    // console.log("nui-select onchange" + this.id + "=" + $event.value );
    if($event){
      let others: any;
      for(var i = 0; i < this.codeNameList.length; i++){
        if(this.codeNameList[i].value == $event.value){
          others = {
            label: this.codeNameList[i].label,
          };
          break;
        }
      }
      let selectEvent = new SelectEventComponent(this.id, $event.value, others);
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
  others: any;

  constructor(id: string, newValue: string, others?: any){
    this.id = id;
    // this.oldValue = oldValue;
    this.newValue = newValue;
    this.others = others;
  }
}
