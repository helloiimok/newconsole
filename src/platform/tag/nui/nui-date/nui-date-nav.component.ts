import {
  forwardRef, Component, ViewChild, ElementRef, Input, OnInit, Output, EventEmitter,
  AfterViewInit
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup} from '@angular/forms';
import {Calendar} from 'primeng/components/calendar/calendar';
import {DateFormControl} from '../form-control/date-form-control';
import * as moment from 'moment';
/**
 * Created by jins on 2017/4/10.
 */
// export const DATE_VALUE_ACCESSOR: any = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => NuiDateComponent),
//   multi: true
// };

@Component({
  template: `
        <div *ngIf="signupForm" [formGroup]="signupForm">
          <p-calendar id="{{id}}" name="{{id}}" formControlName="{{formControlName}}" tooltipPosition="top" [showIcon]="true" [monthNavigator]="true" [yearNavigator]="true"  [yearRange]="year_range"
           (ngModelChange)="onChangeExd($event)" [dateFormat]="format" [showTime]="showTime" [hourFormat]="hourFormat" [disabled]="disabled"
           [locale]="cn"></p-calendar>
        </div>
        <div *ngIf="!signupForm" >
          <p-calendar id="{{id}}" name="{{id}}" tooltipPosition="top" [showIcon]="true" [disabled]="disabled"  [monthNavigator]="true" [yearNavigator]="true" [yearRange]="year_range"
           (ngModelChange)="onChangeExd($event)" [dateFormat]="format" [showTime]="showTime" [hourFormat]="hourFormat"
           [locale]="cn" ></p-calendar>
        </div>
`,
  selector: 'nui-date-nav',
  styles: [],
  // providers:[DATE_VALUE_ACCESSOR]
})
export class NuiDateNavComponent implements OnInit{

  @Input()
  public id: string;

  @Input('group')
  public signupForm: FormGroup;

  @Input('controlname')
  public formControlName: string;

  @Input('format')
  public format = 'yy年mm月dd日';

  @Input('year_range')
  public year_range = '1900:2020';

  // 是否显示时间
  @Input('showTime')
  public showTime: string;
  @Input('hourFormat')
  public hourFormat = '24';

  @Input('disabled')
  public disabled: boolean;

  @ViewChild('p-calendar')
  calendar: Calendar;

  @Output('change')
  public change = new EventEmitter();

  // 本地化处理
  cn: any;

  ngOnInit(){

    this.cn = {
      firstDayOfWeek: 0,
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
      monthNamesShort: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ]
    };
  }
  onChangeExd(value){
    if (value || value == '') {
      return;
    }
    let numberValue;
    // 根据DateFormControl设定的dataFormat，format为number类型后再传递给业务的change事件。
    if (this.signupForm){
      const dateControl = <DateFormControl>this.signupForm.controls[this.formControlName];
      const dateStr = moment(value).format(dateControl.getDataFormat());
      numberValue = Number(dateStr);
    } else {
      console.log('该日期控件为同FormControl绑定使用。id=' + this.id );
    }

    if (this.change){
      this.change.emit({id: this.id, value: numberValue ? numberValue : value});
    }
  }

  convertToTimestamp(formatedDate: Date): number{
    if (formatedDate){
      return formatedDate.getTime();
    }
  }

}
