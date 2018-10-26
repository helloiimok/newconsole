import {Component, Input, AfterViewInit, OnDestroy, ElementRef, ViewChild, OnChanges} from '@angular/core';
import {DomHandler} from "primeng/components/dom/domhandler";

declare var document: any;

@Component({
  selector: 'nui-blockUI',
  template: `
        <div #mask class="ui-blockui ui-widget-overlay" [ngClass]="{'ui-blockui-document':!target}" [ngStyle]="{display: blocked ? 'block' : 'none'}">
            <ng-content></ng-content>
        </div>
    `,
  providers: [DomHandler]
})

/**
 * Form 4.0 PrimeNG BlockUI
 *
 * 由于V2.0版本不支持自定义BlockUI样式，所以添加NuiBlockUI组件。
 * 实现方式同V4.0 p-blockUI 保持一致。
 */
export class NuiBlockUIComponent implements AfterViewInit,OnDestroy {

  @Input() target: any;

  @ViewChild('mask') mask: ElementRef;

  _blocked: boolean;

  constructor(public el: ElementRef,public domHandler: DomHandler) {}

  @Input() get blocked(): boolean {
    return this._blocked;
  }

  set blocked(val: boolean) {
    this._blocked = val;

    if(this.mask.nativeElement) {
      if(this._blocked)
        this.block();
      else
        this.unblock();
    }
  }

  ngAfterViewInit() {
    if(this.target && !this.target.getBlockableElement) {
      throw 'Target of BlockUI must implement BlockableUI interface';
    }
  }

  block() {
    if(this.target) {
      this.target.getBlockableElement().appendChild(this.mask.nativeElement);
      let style = this.target.style||{};
      style.position = 'relative';
      this.target.style = style;
    }
    else {
      document.body.appendChild(this.mask.nativeElement);
    }

    this.mask.nativeElement.style.zIndex = String(++DomHandler.zindex);
  }

  unblock() {
    this.el.nativeElement.appendChild(this.mask.nativeElement);
  }

  ngOnDestroy() {

  }
}

