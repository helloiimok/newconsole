import {Type} from "@angular/core";
/**
 * Created by jins on 2017/3/31.
 */



export class TabItem {
  id: string;
  label: string;
  routLink: string;
  selected = false;
  closable = false;
  // 组件类型
  componentName: string;
  component: Type<any>;

  data?: any;
  contentLoaded: boolean = false;
  // 传入参数
  param?: any;

  constructor(id: string, label: string,  componentName: string, param?: any) {
    this.id = id;
    this.label = label;
    // this.routLink = routLink;
    this.selected = true;
    this.closable = true;
    this.componentName = componentName;
    this.param = param;
  }
}
