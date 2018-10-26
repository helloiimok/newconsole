import {
  NgModule, Component, ElementRef, Input, Output, SimpleChange, EventEmitter, OnChanges,
  SimpleChanges, AfterViewInit
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/primeng";

@Component({
  selector: 'nui-paginator',
  template: `

    <div class="ui-grid ui-grid-responsive ui-grid-pad ui-fluid">
    <div class="ui-grid-row">
      <div class="ui-grid-col-3 ">
        <button pButton label="服务器端导出" *ngIf="isShowServerExport" (click)="doServerExport()"  class="fl ml10 w100"></button>
        <button pButton label="客户端导出" *ngIf="isShowClientExport"  (click)="doClientExport()"  class="fl ml10  w100"></button>
      </div>
      <!--<div class="ui-grid-col-1">-->
      <!--</div>-->
      <!--<div class="ui-grid-col-1">-->
      <!--</div>-->
      <div class="ui-grid-col-6">
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'ui-paginator ui-widget ui-widget-header ui-unselectable-text'"
             *ngIf="alwaysShow ? true : (pageLinks && pageLinks.length > 1)">
          <!--<a href="#" class="ui-paginator-first ui-paginator-element ui-state-default ui-corner-all"-->
             <!--(click)="changePageToFirst($event)" [ngClass]="{'ui-state-disabled':isFirstPage()}" [tabindex]="isFirstPage() ? -1 : null">-->
            <!--<span class="fa fa-step-backward"></span>-->
          <!--</a>-->
          <a href="#" class="ui-paginator-prev ui-paginator-element ui-state-default ui-corner-all"
             (click)="changePageToPrev($event)" [ngClass]="{'ui-state-disabled':isFirstPage()}" [tabindex]="isFirstPage() ? -1 : null">
            <span class="fa fa-backward"></span>
          </a>
          <span class="ui-paginator-pages">
                    <a href="#" *ngFor="let pageLink of pageLinks" class="ui-paginator-page ui-paginator-element ui-state-default ui-corner-all"
                       (click)="changePage(pageLink - 1, $event)" [ngClass]="{'ui-state-active': (pageLink-1 == getPage())}">{{pageLink}}</a>
                </span>
          <a href="#" class="ui-paginator-next ui-paginator-element ui-state-default ui-corner-all"
             (click)="changePageToNext($event)" [ngClass]="{'ui-state-disabled':isLastPage()}" [tabindex]="isLastPage() ? -1 : null">
            <span class="fa fa-forward"></span>
          </a>
          <!--<a href="#" class="ui-paginator-last ui-paginator-element ui-state-default ui-corner-all"-->
             <!--(click)="changePageToLast($event)" [ngClass]="{'ui-state-disabled':isLastPage()}" [tabindex]="isLastPage() ? -1 : null">-->
            <!--<span class="fa fa-step-forward"></span>-->
          <!--</a>-->
          <select class="ui-paginator-rpp-options ui-widget ui-state-default" *ngIf="rowsPerPageOptions" (change)="onRppChange($event)">
            <option *ngFor="let opt of rowsPerPageOptions" [value]="opt" [selected]="rows == opt">{{opt}}</option>
          </select>
        </div>
      </div>
      <div class="ui-grid-col-3 textl">
        <label><span class="fl ft125">  {{rightLabel}}</span></label>
      </div>
    </div>
    </div>
      
  `
})
export class Paginator implements AfterViewInit{

  // @Input() pageLinkSize: number = 5;
  @Input() pageLinkSize: number = 1;

  @Output() onPageChange: EventEmitter<any> = new EventEmitter();

  @Output() onServerExport: EventEmitter<any> = new EventEmitter();

  @Output() onClientExport: EventEmitter<any> = new EventEmitter();

  @Input() style: any;

  @Input() styleClass: string;

  @Input() rowsPerPageOptions: number[];

  @Input() alwaysShow: boolean = true;

  @Input() rightLabel: string = "";

  public pageLinks: number[];

  public _totalRecords: number = 101;

  public _first: number = 0;

  public _rows: number = 0;

  @Input() isShowServerExport = false;

  @Input() isShowClientExport = false;

  @Input() get totalRecords(): number {
    return this._totalRecords;
  }

  set totalRecords(val:number) {
    // this._totalRecords = val;
    // this.updatePageLinks();
    // 不接受外部设值
  }

  @Input() get first(): number {
    return this._first;
  }

  set first(val:number) {
    this._first = val;
    this.updatePageLinks();
  }

  @Input() get rows(): number {
    return this._rows;
  }

  set rows(val:number) {
    this._rows = val;
    this.updatePageLinks();
  }

  isFirstPage() {
    // return this.getPage() === 0;
    return false;
  }

  isLastPage() {
    // return this.getPage() === this.getPageCount() - 1;
    return false;
  }

  ngAfterViewInit(){
    // NOP
  }


  getPageCount() {
    return Math.ceil(this.totalRecords/this.rows)||1;
  }

  calculatePageLinkBoundaries() {
    let numberOfPages = this.getPageCount(),
      visiblePages = Math.min(this.pageLinkSize, numberOfPages);

    //calculate range, keep current in middle if necessary
    let start = Math.max(0, Math.ceil(this.getPage() - ((visiblePages) / 2))),
      end = Math.min(numberOfPages - 1, start + visiblePages - 1);

    //check when approaching to last page
    var delta = this.pageLinkSize - (end - start + 1);
    start = Math.max(0, start - delta);

    return [start, end];
  }

  updatePageLinks() {
    this.pageLinks = [];
    let boundaries = this.calculatePageLinkBoundaries(),
      start = boundaries[0],
      end = boundaries[1];

    for(let i = start; i <= end; i++) {
      this.pageLinks.push(i + 1);
    }
  }

  changePage(p :number, event) {
    var pc = this.getPageCount();

    if(p >= 0 && p < pc) {
      this.first = this.rows * p;
      var state = {
        page: p,
        first: this.first,
        rows: this.rows,
        pageCount: pc
      };
      this.updatePageLinks();
      this.onPageChange.emit(state);
    }

    if(event) {
      event.preventDefault();
    }
  }

  getPage(): number {
    return Math.floor(this.first / this.rows);
  }

  changePageToFirst(event) {
    this.changePage(0, event);
  }

  changePageToPrev(event) {
    this.changePage(this.getPage() - 1, event);
    if(this.getPage() > 0) {
      this._totalRecords -= this.rows;
    }
  }

  changePageToNext(event) {
    this.changePage(this.getPage()  + 1, event);
    this._totalRecords += this.rows;
  }

  changePageToLast(event) {
    this.changePage(this.getPageCount() - 1, event);
  }

  onRppChange(event) {
    this.rows = this.rowsPerPageOptions[event.target.selectedIndex];
    this.changePageToFirst(event);
  }

  /**
   * 服务器端导出
   */
  doServerExport(){
    if(this.onServerExport){
      this.onServerExport.emit();
    }
  }

  /**
   * 客户端导出
   */
  doClientExport(){
    if(this.onClientExport){
      this.onClientExport.emit();
    }
  }
}

@NgModule({
  imports: [CommonModule, ButtonModule],
  exports: [Paginator],
  declarations: [Paginator]
})
export class NuiPaginatorModule { }
