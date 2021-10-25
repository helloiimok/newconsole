/** copy src from V2.0.6 修改lazy模式下filter和sort的行为。
 *
 * Lazy模式代码涉及太广，修改可能带来很多问题。
 * 添加LazyPaging属性，只控制Server端分页，而不控制Filter和Sort功能。
 * */
import {
  NgModule, Component, ElementRef, AfterContentInit, AfterViewInit, AfterViewChecked, OnInit, OnDestroy, DoCheck, Input,
  ViewContainerRef, ViewChild,
  Output, EventEmitter, ContentChild, ContentChildren, Renderer, IterableDiffers, QueryList, TemplateRef,
  ChangeDetectorRef, Inject, forwardRef, SimpleChanges, OnChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/primeng';
import {Column, Header, Footer, HeaderColumnGroup, FooterColumnGroup, PrimeTemplate} from 'primeng/primeng';
import {LazyLoadEvent, FilterMetadata, SortMeta} from 'primeng/primeng';
import {DomHandler} from 'primeng/primeng';
import {Subscription} from 'rxjs/Subscription';
import {BlockableUI} from 'primeng/primeng';
import {SharedModule} from 'primeng/primeng';
// import {ObjectUtils} from '../components/utils/objectutils';
import {NuiPaginatorModule} from '../../nui/nui-paginator/nui-paginator';
import {UtilService} from '../../../util/util.service';

@Component({
  selector: 'p-dtRadioButton',
  template: `
    <div class="ui-radiobutton ui-widget">
      <div class="ui-helper-hidden-accessible">
        <input type="radio" [checked]="checked">
      </div>
      <div class="ui-radiobutton-box ui-widget ui-radiobutton-relative ui-state-default" (click)="handleClick($event)"
           (mouseenter)="hover=true" (mouseleave)="hover=false"
           [ngClass]="{'ui-state-hover':hover,'ui-state-active':checked}">
        <span class="ui-radiobutton-icon" [ngClass]="{'fa fa-circle':checked}"></span>
      </div>
    </div>
  `
})
export class DTRadioButton {

  @Input() checked: boolean;

  @Input() disabled: boolean; //是否可以选中

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  public hover: boolean;

  handleClick(event) {
    if (!this.disabled){
      this.onClick.emit(event);
    }

  }
}

@Component({
  selector: 'p-dtCheckbox',
  template: `
    <div class="ui-chkbox ui-widget">
      <div class="ui-helper-hidden-accessible">
        <input type="checkbox" [checked]="checked">
      </div>
      <div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default" (click)="handleClick($event)"
           (mouseover)="hover=true" (mouseout)="hover=false"
           [ngClass]="{'ui-state-hover':hover&&!disabled,'ui-state-active':checked&&!disabled,'ui-state-disabled':disabled}">
        <span class="ui-chkbox-icon ui-c" [ngClass]="{'fa fa-check':checked}"></span>
      </div>
    </div>
  `
})
export class DTCheckbox {

  @Input() checked: boolean;

  @Input() disabled: boolean;

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  public hover: boolean;

  handleClick(event) {
    if (!this.disabled) {
      this.onChange.emit({originalEvent: event, checked: !this.checked});
    }
  }
}

@Component({
  selector: 'p-rowExpansionLoader',
  template: ` `
})
export class RowExpansionLoader {

  @Input() template: TemplateRef<any>;

  @Input() rowData: any;

  constructor(public viewContainer: ViewContainerRef) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    const view = this.viewContainer.createEmbeddedView(this.template, {
      '\$implicit': this.rowData
    });
  }
}

@Component({
  selector: '[pColumnHeaders]',
  template: `
    <ng-template ngFor let-col [ngForOf]="columns" let-lastCol="last">
      <th #headerCell [ngStyle]="col.style" [class]="col.styleClass"
          [style.display]="col.hidden ? 'none' : 'table-cell'"
          (click)="dt.sort($event,col)" [attr.colspan]="col.colspan" [attr.rowspan]="col.rowspan"
          [ngClass]="{'ui-state-default ui-unselectable-text':true, 'ui-sortable-column': col.sortable,
           'ui-state-active': dt.isSorted(col), 'ui-resizable-column': dt.resizableColumns, 'ui-selection-column':col.selectionMode}"
          (dragstart)="dt.onColumnDragStart($event)" (dragover)="dt.onColumnDragover($event)"
          (dragleave)="dt.onColumnDragleave($event)" (drop)="dt.onColumnDrop($event)" (mousedown)="dt.onHeaderMousedown($event,headerCell)"
          [attr.tabindex]="col.sortable ? tabindex : null" (keydown)="dt.onHeaderKeydown($event,col)">
        <span class="ui-column-resizer"
              *ngIf="dt.resizableColumns && ((dt.columnResizeMode == 'fit' && !lastCol) || dt.columnResizeMode == 'expand')"
              (mousedown)="dt.initColumnResize($event)"></span>
        <span class="ui-column-title" *ngIf="!col.selectionMode&&!col.headerTemplate">{{col.header}}</span>
        <span class="ui-column-title" *ngIf="col.headerTemplate">
                    <p-columnHeaderTemplateLoader [column]="col"></p-columnHeaderTemplateLoader>
                </span>
        <span class="ui-sortable-column-icon fa fa-fw fa-sort" *ngIf="col.sortable"
              [ngClass]="{'fa-sort-desc': (dt.getSortOrder(col) == -1),'fa-sort-asc': (dt.getSortOrder(col) == 1)}"></span>
        <input type="text" pInputText class="ui-column-filter" [attr.placeholder]="col.filterPlaceholder"
               *ngIf="col.filter&&!col.filterTemplate" [value]="dt.filters[col.field] ? dt.filters[col.field].value : ''"
               (click)="dt.onFilterInputClick($event)" (keyup)="dt.onFilterKeyup($event.target['value'], col.field, col.filterMatchMode)"/>
        <p-columnFilterTemplateLoader [column]="col" *ngIf="col.filterTemplate"></p-columnFilterTemplateLoader>
        <p-dtCheckbox *ngIf="col.selectionMode=='multiple'" (onChange)="dt.toggleRowsWithCheckbox($event)" [checked]="dt.allSelected"
                      [disabled]="dt.isEmpty()"></p-dtCheckbox>
      </th>
    </ng-template>
  `
})
export class ColumnHeaders {

  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable) {}

  @Input('pColumnHeaders') columns: Column[];

  tabindex: any;
}

@Component({
  selector: '[pColumnFooters]',
  template: `
    <td *ngFor="let col of columns" [ngStyle]="col.style" [class]="col.styleClass"
        [attr.colspan]="col.colspan" [attr.rowspan]="col.rowspan"
        [ngClass]="{'ui-state-default':true}" [style.display]="col.hidden ? 'none' : 'table-cell'">
      <span class="ui-column-footer" *ngIf="!col.footerTemplate">{{col.footer}}</span>
      <span class="ui-column-footer" *ngIf="col.footerTemplate">
                <p-columnFooterTemplateLoader [column]="col"></p-columnFooterTemplateLoader>
            </span>
    </td>
  `
})
export class ColumnFooters {

  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable) {}

  @Input('pColumnFooters') columns: Column[];
}

@Component({
  selector: '[pTableBody]',
  template: `
    <ng-template ngFor let-rowData [ngForOf]="dt.dataToRender" let-even="even" let-odd="odd" let-rowIndex="index">
      <tr #rowGroupElement class="ui-widget-header ui-rowgroup-header"
          *ngIf="dt.rowGroupMode=='subheader' && (rowIndex === 0||
          (dt.resolveFieldData(rowData,dt.groupField) !== dt.resolveFieldData(dt.dataToRender[rowIndex - 1], dt.groupField)))"
          (click)="dt.onRowGroupClick($event)" [ngStyle]="{'cursor': dt.sortableRowGroup ? 'pointer' : 'auto'}">
        <td [attr.colspan]="columns.length">
          <a href="#" *ngIf="dt.expandableRowGroups" (click)="dt.toggleRowGroup($event,rowData)">
            <span class="fa fa-fw" [ngClass]="{'fa-chevron-circle-down':dt.isRowGroupExpanded(rowData),
            'fa-chevron-circle-right': !dt.isRowGroupExpanded(rowData)}"></span>
          </a>
          <p-templateLoader [template]="dt.rowGroupHeaderTemplate" [data]="rowData"></p-templateLoader>
        </td>
      </tr>
      <tr #rowElement *ngIf="!dt.expandableRowGroups||dt.isRowGroupExpanded(rowData)" [class]="dt.getRowStyleClass(rowData,rowIndex)"
          (click)="dt.handleRowClick($event, rowData)" (dblclick)="dt.rowDblclick($event,rowData)"
          (contextmenu)="dt.onRowRightClick($event,rowData)" (touchend)="dt.handleRowTouchEnd($event)"
          [ngClass]="{'ui-datatable-even':even&&dt.rowGroupMode!='rowspan',
          'ui-datatable-odd':odd&&dt.rowGroupMode!='rowspan','ui-state-highlight': dt.isSelected(rowData)}">
        <ng-template ngFor let-col [ngForOf]="columns" let-colIndex="index">
          <td #cell *ngIf="!dt.rowGroupMode || (dt.rowGroupMode == 'subheader') ||
                        (dt.rowGroupMode=='rowspan' && ((dt.sortField==col.field &&
                        dt.rowGroupMetadata[dt.resolveFieldData(rowData,dt.sortField)].index == rowIndex) || (dt.sortField!=col.field)))"
              [ngStyle]="col.style" [class]="col.styleClass" [style.display]="col.hidden ? 'none' : 'table-cell'"
              [ngClass]="{'ui-editable-column':col.editable,'ui-selection-column':col.selectionMode}"
              (click)="dt.switchCellToEditMode(cell,col,rowData)"
              [attr.rowspan]="(dt.rowGroupMode=='rowspan' && dt.sortField == col.field &&
              dt.rowGroupMetadata[dt.resolveFieldData(rowData,dt.sortField)].index == rowIndex) ?
              dt.rowGroupMetadata[dt.resolveFieldData(rowData,dt.sortField)].size : null">
            <span class="ui-column-title" *ngIf="dt.responsive">{{col.header}}</span>
            <span class="ui-cell-data" *ngIf="!col.bodyTemplate && !col.expander &&
            !col.selectionMode">{{dt.resolveFieldData(rowData,col.field)}}</span>
            <span class="ui-cell-data" *ngIf="col.bodyTemplate">
                            <p-columnBodyTemplateLoader [column]="col" [rowData]="rowData" [rowIndex]="rowIndex + dt.first">

                            </p-columnBodyTemplateLoader>
                        </span>
            <div class="ui-cell-editor" *ngIf="col.editable">
              // tslint:disable-next-line:max-line-length
              <input *ngIf="!col.editorTemplate" type="text" pInputText [(ngModel)]="rowData[col.field]" required="true"
                     (blur)="dt.switchCellToViewMode($event.target)"
                     (keydown)="dt.onCellEditorKeydown($event, col, rowData, colIndex)"/>
              <p-columnEditorTemplateLoader *ngIf="col.editorTemplate" [column]="col" [rowData]="rowData"></p-columnEditorTemplateLoader>
            </div>
            <a href="#" *ngIf="col.expander" (click)="dt.toggleRow(rowData,$event)">
              <span class="ui-row-toggler fa fa-fw ui-c" [ngClass]="{'fa-chevron-circle-down':dt.isRowExpanded(rowData),
              'fa-chevron-circle-right': !dt.isRowExpanded(rowData)}"></span>
            </a>
            <p-dtRadioButton *ngIf="col.selectionMode=='single'" (onClick)="dt.selectRowWithRadio($event, rowData)"
                             [checked]="dt.isSelected(rowData)" [disabled]="dt.isDisabled(rowData)"></p-dtRadioButton>
            <p-dtCheckbox *ngIf="col.selectionMode=='multiple'" (onChange)="dt.toggleRowWithCheckbox($event,rowData)"
                          [checked]="dt.isSelected(rowData)"></p-dtCheckbox>
          </td>
        </ng-template>
      </tr>
      <tr class="ui-widget-header" *ngIf="dt.rowGroupFooterTemplate && dt.rowGroupMode=='subheader' && ((rowIndex === dt.dataToRender.length - 1)||(dt.resolveFieldData(rowData,dt.groupField) !== dt.resolveFieldData(dt.dataToRender[rowIndex + 1],dt.groupField))) && (!dt.expandableRowGroups || dt.isRowGroupExpanded(rowData))">
        <p-templateLoader class="ui-helper-hidden" [data]="rowData" [template]="dt.rowGroupFooterTemplate"></p-templateLoader>
      </tr>
      <tr *ngIf="dt.expandableRows && dt.isRowExpanded(rowData)">
        <td [attr.colspan]="dt.visibleColumns().length">
          <p-rowExpansionLoader [rowData]="rowData" [template]="dt.rowExpansionTemplate"></p-rowExpansionLoader>
        </td>
      </tr>
    </ng-template>
    <tr *ngIf="dt.isEmpty()" class="ui-widget-content">
      <td [attr.colspan]="dt.visibleColumns().length" class="ui-datatable-emptymessage">{{dt.emptyMessage}}</td>
    </tr>
  `
})
export class TableBody {

  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable) {}

  @Input('pTableBody') columns: Column[];

  visibleColumns() {
    return this.columns ? this.columns.filter(c => !c.hidden) : [];
  }
}

@Component({
  selector: '[pScrollableView]',
  template: `
    <div #scrollHeader class="ui-widget-header ui-datatable-scrollable-header" [ngStyle]="{'width': width}">
      <div #scrollHeaderBox  class="ui-datatable-scrollable-header-box">
        <table [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle">
          <thead class="ui-datatable-thead">
          <tr *ngIf="!dt.headerColumnGroup" class="ui-state-default" [pColumnHeaders]="columns"></tr>
          <ng-template [ngIf]="dt.headerColumnGroup">
            <tr *ngFor="let headerRow of dt.headerColumnGroup.rows" class="ui-state-default" [pColumnHeaders]="headerRow.columns"></tr>
          </ng-template>
          </thead>
        </table>
      </div>
    </div>
    <div #scrollBody class="ui-datatable-scrollable-body overflow-scroll" [ngStyle]="{'width': width,'max-height':dt.scrollHeight}">
      <div #scrollTableWrapper style="position:relative" [ngStyle]="{'height':virtualTableHeight}">
        <table #scrollTable [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle" [ngClass]="{'ui-datatable-virtual-table':virtualScroll}" style="top:0px">
          <colgroup class="ui-datatable-scrollable-colgroup">
            <col *ngFor="let col of dt.visibleColumns()" />
          </colgroup>
          <tbody [ngClass]="{'ui-datatable-data ui-widget-content': true, 'ui-datatable-hoverable-rows': (dt.rowHover||dt.selectionMode)}" [pTableBody]="columns"></tbody>
        </table>
      </div>
      <div class="ui-widget-overlay ui-datatable-load-status" *ngIf="loading"></div>
    </div>
    <div #scrollFooter class="ui-widget-header ui-datatable-scrollable-footer" [ngStyle]="{'width': width}" *ngIf="dt.hasFooter()">
      <div #scrollFooterBox  class="ui-datatable-scrollable-footer-box">
        <table [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle">
          <tfoot class="ui-datatable-tfoot">
          <tr *ngIf="!footerColumnGroup" [pColumnFooters]="columns" class="ui-state-default"></tr>
          <ng-template [ngIf]="footerColumnGroup">
            <tr *ngFor="let footerRow of footerColumnGroup.rows" [pColumnFooters]="footerRow.columns"></tr>
          </ng-template>
          </tfoot>
        </table>
      </div>
    </div>
  `
})
export class ScrollableView implements AfterViewInit, AfterViewChecked, OnDestroy {

  constructor(@Inject(forwardRef(() => DataTable)) public dt: DataTable, public domHandler: DomHandler, public el: ElementRef, public renderer: Renderer) {}

  @Input('pScrollableView') columns: Column[];

  @ViewChild('scrollHeader') scrollHeaderViewChild: ElementRef;

  @ViewChild('scrollHeaderBox') scrollHeaderBoxViewChild: ElementRef;

  @ViewChild('scrollBody') scrollBodyViewChild: ElementRef;

  @ViewChild('scrollTable') scrollTableViewChild: ElementRef;

  @ViewChild('scrollTableWrapper') scrollTableWrapperViewChild: ElementRef;

  @ViewChild('scrollFooter') scrollFooterViewChild: ElementRef;

  @ViewChild('scrollFooterBox') scrollFooterBoxViewChild: ElementRef;

  @Input() frozen: boolean;

  @Input() width: string;

  @Input() virtualScroll: boolean;

  @Output() onVirtualScroll: EventEmitter<any> = new EventEmitter();

  @Input() loading: boolean;

  public scrollBody: HTMLDivElement;

  public scrollHeader: HTMLDivElement;

  public scrollHeaderBox: HTMLDivElement;

  public scrollTable: HTMLDivElement;

  public scrollTableWrapper: HTMLDivElement;

  public scrollFooter: HTMLDivElement;

  public scrollFooterBox: HTMLDivElement;

  public bodyScrollListener: Function;

  public headerScrollListener: Function;

  public scrollBodyMouseWheelListener: Function;

  public scrollFunction: Function;

  public rowHeight: number;

  public scrollTimeout: any;

  footerColumnGroup: any;
  private frozenScrollBody: any;

  ngAfterViewInit() {
    this.initScrolling();
  }

  ngAfterViewChecked() {
    if (this.virtualScroll && !this.rowHeight) {
      const row = this.domHandler.findSingle(this.scrollTable, 'tr.ui-widget-content');
      if (row) {
        this.rowHeight = this.domHandler.getOuterHeight(row);
      }
    }
  }

  initScrolling() {
    this.scrollHeader = <HTMLDivElement> this.scrollHeaderViewChild.nativeElement;
    this.scrollHeaderBox = <HTMLDivElement> this.scrollHeaderBoxViewChild.nativeElement;
    this.scrollBody = <HTMLDivElement> this.scrollBodyViewChild.nativeElement;
    this.scrollTable = <HTMLDivElement> this.scrollTableViewChild.nativeElement;
    this.scrollTableWrapper = <HTMLDivElement> this.scrollTableWrapperViewChild.nativeElement;
    this.scrollFooter =  this.scrollFooterViewChild ? <HTMLDivElement> this.scrollFooterViewChild.nativeElement : null;
    this.scrollFooterBox =  this.scrollFooterBoxViewChild ? <HTMLDivElement> this.scrollFooterBoxViewChild.nativeElement : null;

    if (!this.frozen) {
      const frozenView = this.el.nativeElement.previousElementSibling;
      if (frozenView) {
        const frozenScrollBody = this.domHandler.findSingle(frozenView, '.ui-datatable-scrollable-body');
      }

      this.bodyScrollListener = this.renderer.listen(this.scrollBody, 'scroll', (event) => {
        this.scrollHeaderBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';

        if (this.scrollFooterBox) {
          this.scrollFooterBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';
        }

        if (this.frozenScrollBody) {
          this.frozenScrollBody.scrollTop = this.scrollBody.scrollTop;
        }

        if (this.virtualScroll) {
          clearTimeout(this.scrollTimeout);
          this.scrollTimeout = setTimeout(() => {
            const viewport = this.domHandler.getOuterHeight(this.scrollBody);
            const tableHeight = this.domHandler.getOuterHeight(this.scrollTable);
            const pageHeight = this.rowHeight * this.dt.rows;
            const virtualTableHeight = parseFloat(this.virtualTableHeight);
            const pageCount = (virtualTableHeight / pageHeight) || 1;

            if (this.scrollBody.scrollTop + viewport > parseFloat(this.scrollTable.style.top) + tableHeight || this.scrollBody.scrollTop < parseFloat(this.scrollTable.style.top)) {
              const page = Math.floor((this.scrollBody.scrollTop * pageCount) / (this.scrollBody.scrollHeight)) + 1;
              this.onVirtualScroll.emit({
                page: page
              });
              this.scrollTable.style.top = ((page - 1) * pageHeight) + 'px';
            }
          }, 200);
        }
      });

      //to trigger change detection
      this.scrollBodyMouseWheelListener = this.renderer.listen(this.scrollBody, 'mousewheel', (event) => {});

      this.headerScrollListener = this.renderer.listen(this.scrollHeader, 'scroll', () => {
        this.scrollHeader.scrollLeft = 0;
      });
    }

    const scrollBarWidth = this.domHandler.calculateScrollbarWidth();
    if (!this.frozen) {
      this.scrollHeaderBox.style.marginRight = scrollBarWidth + 'px';

      if (this.scrollFooterBox) {
        this.scrollFooterBox.style.marginRight = scrollBarWidth + 'px';
      }
    }
    else {
      this.scrollBody.style.paddingBottom = scrollBarWidth + 'px';
    }
  }

  get virtualTableHeight(): string {
    // Mod by jins 20170614 如果totalRecords绑定了值，则使用该值。否则使用结果集的length
    // let totalRecords = this.dt.lazy ? this.dt.totalRecords : (this.dt.value ? this.dt.value.length: 0);
    const totalRecords = this.dt.lazyPaging ? this.dt.totalRecords : (this.dt.value ? this.dt.value.length : 0);
    return (totalRecords * this.rowHeight) + 'px';
  }

  ngOnDestroy() {
    if (this.bodyScrollListener) {
      this.bodyScrollListener();
    }

    if (this.scrollBodyMouseWheelListener) {
      this.scrollBodyMouseWheelListener();
    }

    if (this.headerScrollListener) {
      this.headerScrollListener();
    }
  }
}

@Component({
  selector: 'p-dataTable',
  template: `
    <div [ngStyle]="style" [class]="styleClass" [style.width]="containerWidth"
         [ngClass]="{'ui-datatable ui-widget':true,'ui-datatable-reflow':responsive,'ui-datatable-stacked':stacked,'ui-datatable-resizable':resizableColumns,'ui-datatable-scrollable':scrollable}">
      <div class="ui-datatable-header ui-widget-header" *ngIf="header">
        <ng-content select="p-header"></ng-content>
      </div>
      <nui-paginator [rows]="rows" [first]="first" [totalRecords]="totalRecords" [pageLinkSize]="pageLinks" styleClass="ui-paginator-top" [alwaysShow]="alwaysShowPaginator"
                     (onPageChange)="paginate($event)" [rowsPerPageOptions]="rowsPerPageOptions" *ngIf="paginator && paginatorPosition =='top' || paginatorPosition =='both'"
                     [rightLabel]="rightLabel"  (onServerExport)="doServerExport()" (onClientExport)="doClientExport()"
                     [isShowServerExport]="isShowServerExport" [isShowClientExport]="isShowClientExport"></nui-paginator>
      <div class="ui-datatable-tablewrapper" *ngIf="!scrollable">
        <table [class]="tableStyleClass" [ngStyle]="tableStyle">
          <thead class="ui-datatable-thead">
          <tr *ngIf="!headerColumnGroup" class="ui-state-default" [pColumnHeaders]="columns"></tr>
          <ng-template [ngIf]="headerColumnGroup">
            <tr *ngFor="let headerRow of headerColumnGroup.rows" class="ui-state-default" [pColumnHeaders]="headerRow.columns"></tr>
          </ng-template>
          </thead>
          <tfoot *ngIf="hasFooter()" class="ui-datatable-tfoot">
          <tr *ngIf="!footerColumnGroup" class="ui-state-default" [pColumnFooters]="columns"></tr>
          <ng-template [ngIf]="footerColumnGroup">
            <tr *ngFor="let footerRow of footerColumnGroup.rows" class="ui-state-default" [pColumnFooters]="footerRow.columns"></tr>
          </ng-template>
          </tfoot>
          <tbody [ngClass]="{'ui-datatable-data ui-widget-content': true, 'ui-datatable-hoverable-rows': (rowHover||selectionMode)}" [pTableBody]="columns"></tbody>
        </table>
      </div>

      <ng-template [ngIf]="scrollable">
        <div class="ui-datatable-scrollable-wrapper ui-helper-clearfix" [ngClass]="{'max-height':scrollHeight}">
          <div *ngIf="frozenColumns" [pScrollableView]="frozenColumns" frozen="true"
               [ngStyle]="{'width':this.frozenWidth}" class="ui-datatable-scrollable-view ui-datatable-frozen-view"></div>
          <div [pScrollableView]="scrollableColumns" [ngStyle]="{'width':this.unfrozenWidth, 'left': this.frozenWidth}"
               class="ui-datatable-scrollable-view" [virtualScroll]="virtualScroll" (onVirtualScroll)="onVirtualScroll($event)" [loading]="loading"
               [ngClass]="{'ui-datatable-unfrozen-view': frozenColumns}"></div>
        </div>
      </ng-template>
      <!-- footer移动到分页上面 -->
      <div class="ui-datatable-footer ui-widget-header" *ngIf="footer">
        <ng-content select="p-footer"></ng-content>
      </div>

      <nui-paginator [rows]="rows" [first]="first" [totalRecords]="totalRecords" [pageLinkSize]="pageLinks"
                     styleClass="ui-paginator-bottom" [alwaysShow]="alwaysShowPaginator"
                     (onPageChange)="paginate($event)" [rowsPerPageOptions]="rowsPerPageOptions"
                     *ngIf="paginator && paginatorPosition =='bottom' || paginatorPosition =='both'"
                     [rightLabel]="rightLabel" (onServerExport)="doServerExport()" (onClientExport)="doClientExport()"
                     [isShowServerExport]="isShowServerExport" [isShowClientExport]="isShowClientExport"></nui-paginator>
      <div class="ui-column-resizer-helper ui-state-highlight" style="display:none"></div>
      <span class="fa fa-arrow-down ui-datatable-reorder-indicator-up" style="position: absolute; display: none;"></span>
      <span class="fa fa-arrow-up ui-datatable-reorder-indicator-down" style="position: absolute; display: none;"></span>
    </div>
  `,
  providers: [DomHandler]
})
export class DataTable implements AfterViewChecked, AfterViewInit, AfterContentInit, OnInit, DoCheck, OnDestroy, BlockableUI {

  @Input() value: any[];

  @Input() paginator: boolean;

  @Input() rows: number;

  @Input() totalRecords: number;

  @Input() pageLinks = 5;

  @Input() rowsPerPageOptions: number[];

  @Input() responsive: boolean;

  @Input() stacked: boolean;

  @Input() selectionMode: string;

  @Input() selection: any;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @Input() editable: boolean;

  @Output() onRowClick: EventEmitter<any> = new EventEmitter();

  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();

  @Output() onRowUnselect: EventEmitter<any> = new EventEmitter();

  @Output() onRowDblclick: EventEmitter<any> = new EventEmitter();

  @Output() onHeaderCheckboxToggle: EventEmitter<any> = new EventEmitter();

  @Output() onContextMenuSelect: EventEmitter<any> = new EventEmitter();

  @Input() filterDelay = 300;

  @Input() lazy: boolean;

  // Add jins 20170614 添加属性，只设定分页为Lazy模式。filter，sort还是client模式。
  @Input() lazyPaging: boolean;

  @Output() onLazyLoad: EventEmitter<any> = new EventEmitter();

  @Input() resizableColumns: boolean;

  @Input() columnResizeMode = 'fit';

  @Output() onColResize: EventEmitter<any> = new EventEmitter();

  @Input() reorderableColumns: boolean;

  @Output() onColReorder: EventEmitter<any> = new EventEmitter();

  @Input() scrollable: boolean;

  @Input() virtualScroll: boolean;

  @Input() scrollHeight: any;

  @Input() scrollWidth: any;

  @Input() frozenWidth: any;

  @Input() unfrozenWidth: any;

  @Input() style: any;

  @Input() styleClass: string;

  @Input() tableStyle: any;

  @Input() tableStyleClass: string;

  @Input() globalFilter: any;

  @Input() sortMode = 'single';

  @Input() sortField: string;

  @Input() sortOrder = 1;

  @Input() groupField: string;

  @Input() multiSortMeta: SortMeta[];

  @Input() contextMenu: any;

  @Input() csvSeparator = ',';

  @Input() exportFilename = 'download';

  @Input() emptyMessage = 'No records found';

  @Input() paginatorPosition = 'bottom';

  @Input() metaKeySelection = true;

  @Output() onEditInit: EventEmitter<any> = new EventEmitter();

  @Output() onEditComplete: EventEmitter<any> = new EventEmitter();

  @Output() onEdit: EventEmitter<any> = new EventEmitter();

  @Output() onEditCancel: EventEmitter<any> = new EventEmitter();

  @Output() onPage: EventEmitter<any> = new EventEmitter();

  @Output() onSort: EventEmitter<any> = new EventEmitter();

  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  @ContentChild(Header) header;

  @ContentChild(Footer) footer;

  @Input() expandableRows: boolean;

  @Input() expandedRows: any[];

  @Input() expandableRowGroups: boolean;

  @Input() rowExpandMode = 'multiple';

  @Input() public expandedRowsGroups: any[];

  @Input() tabindex = 1;

  @Input() rowStyleClass: Function;

  @Input() rowGroupMode: string;

  @Input() sortableRowGroup = true;

  @Input() sortFile: string;

  @Input() rowHover: boolean;

  @Input() first = 0;

  // Add 张宏喜 20170714 添加属性，只设定是否有选中disabled控制，赋值为数组属性名，该属性为boolean类型。
  @Input() selDisabledCol: string;

  @Input() public filters: {[s: string]: FilterMetadata; } = {};

  @Input() alwaysShowPaginator = true;

  @Output() onRowExpand: EventEmitter<any> = new EventEmitter();

  @Output() onRowCollapse: EventEmitter<any> = new EventEmitter();

  @Output() onRowGroupExpand: EventEmitter<any> = new EventEmitter();

  @Output() onRowGroupCollapse: EventEmitter<any> = new EventEmitter();

  @Input() isShowServerExport = false;

  @Input() isShowClientExport = false;

  @Input() rightLabel: string;

  // 服务器端导出
  @Output() onServerExport: EventEmitter<any> = new EventEmitter();

  // 客户端导出
  @Output() onClientExport: EventEmitter<any> = new EventEmitter();

  @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;

  @ContentChildren(Column) cols: QueryList<Column>;

  @ContentChild(HeaderColumnGroup) headerColumnGroup: HeaderColumnGroup;

  @ContentChild(FooterColumnGroup) footerColumnGroup: FooterColumnGroup;

  public dataToRender: any[];

  public page = 0;

  public filterTimeout: any;

  public filteredValue: any[];

  public columns: Column[];

  public frozenColumns: Column[];

  public scrollableColumns: Column[];

  public columnsChanged = false;

  public dataChanged = false;

  public stopSortPropagation: boolean;

  public sortColumn: Column;

  public columnResizing: boolean;

  public lastResizerHelperX: number;

  public documentColumnResizeListener: Function;

  public documentColumnResizeEndListener: Function;

  public resizerHelper: any;

  public resizeColumn: any;

  public reorderIndicatorUp: any;

  public reorderIndicatorDown: any;

  public draggedColumn: any;

  public dropPosition: number;

  public tbody: any;

  public rowTouched: boolean;

  public rowGroupToggleClick: boolean;

  public editingCell: any;

  public stopFilterPropagation: boolean;

  public rowGroupMetadata: any;

  public rowGroupHeaderTemplate: TemplateRef<any>;

  public rowGroupFooterTemplate: TemplateRef<any>;

  public rowExpansionTemplate: TemplateRef<any>;

  public scrollBarWidth: number;

  public loading: boolean;

  differ: any;

  globalFilterFunction: any;

  columnsSubscription: Subscription;

  constructor(public el: ElementRef, public domHandler: DomHandler, differs: IterableDiffers,
              public renderer: Renderer, public changeDetector: ChangeDetectorRef,
              public utilService: UtilService) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    if (this.lazy) {
      this.onLazyLoad.emit(this.createLazyLoadMetadata());
    }
  }

  ngAfterContentInit() {
    this.initColumns();

    this.columnsSubscription = this.cols.changes.subscribe(_ => {
      this.initColumns();
      this.changeDetector.markForCheck();
    });

    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'rowexpansion':
          this.rowExpansionTemplate = item.template;
          break;

        case 'rowgroupheader':
          this.rowGroupHeaderTemplate = item.template;
          break;

        case 'rowgroupfooter':
          this.rowGroupFooterTemplate = item.template;
          break;
      }
    });
  }

  ngAfterViewChecked() {
    if (this.columnsChanged && this.el.nativeElement.offsetParent) {
      if (this.resizableColumns) {
        this.initResizableColumns();
      }

      if (this.reorderableColumns) {
        this.initColumnReordering();
      }

      this.columnsChanged = false;
    }

    if (this.dataChanged) {
      this.dataChanged = false;
    }
  }

  ngAfterViewInit() {
    if (this.globalFilter) {
      this.globalFilterFunction = this.renderer.listen(this.globalFilter, 'keyup', () => {
        this.filterTimeout = setTimeout(() => {
          this._filter();
          this.filterTimeout = null;
        }, this.filterDelay);
      });
    }
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.value);
    if (changes) {
      this.dataChanged = true;
      if (this.paginator) {
        this.updatePaginator();
      }

      if (this.hasFilter()) {
        if (this.lazy) {
          //prevent loop
          if (this.stopFilterPropagation)
            this.stopFilterPropagation = false;
          else
            this._filter();
        }
        else {
          this._filter();
        }
      }

      if (this.stopSortPropagation) {
        this.stopSortPropagation = false;
      }
      else if (!this.lazy && (this.sortField || this.multiSortMeta)) {
        if (!this.sortColumn && this.columns) {
          this.sortColumn = this.columns.find(col => col.field === this.sortField && col.sortable === 'custom');
        }

        if (this.sortMode == 'single')
          this.sortSingle();
        else if (this.sortMode == 'multiple')
          this.sortMultiple();
      }

      this.updateDataToRender(this.filteredValue || this.value);
    }
  }

  initColumns(): void {
    this.columns = this.cols.toArray();

    if (this.scrollable) {
      this.scrollableColumns = [];
      this.cols.forEach((col) => {
        if (col.frozen) {
          this.frozenColumns = this.frozenColumns || [];
          this.frozenColumns.push(col);
        }
        else {
          this.scrollableColumns.push(col);
        }
      });
    }

    this.columnsChanged = true;
  }

  resolveFieldData(data: any, field: string): any {
    if (data && field) {
      if (field.indexOf('.') == -1) {
        return data[field];
      }
      else {
        const fields: string[] = field.split('.');
        let value = data;
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    }
    else {
      return null;
    }
  }

  updateRowGroupMetadata() {
    this.rowGroupMetadata = {};
    if (this.dataToRender) {
      for (let i = 0; i < this.dataToRender.length; i++) {
        const rowData = this.dataToRender[i];
        const group = this.resolveFieldData(rowData, this.sortField);
        if (i == 0) {
          this.rowGroupMetadata[group] = {index: 0, size: 1};
        }
        else {
          const previousRowData = this.dataToRender[i - 1];
          const previousRowGroup = this.resolveFieldData(previousRowData, this.sortField);
          if (group === previousRowGroup) {
            this.rowGroupMetadata[group].size++;
          }
          else {
            this.rowGroupMetadata[group] = {index: i, size: 1};
          }
        }
      }
    }
  }

  updatePaginator() {
    //total records
    // Mod by jins 20170614 如果totalRecords绑定了值，则使用该值。否则使用结果集的length
    if (this.totalRecords > 0) {
      // this.totalRecords = this.lazy ? this.totalRecords : (this.value ? this.value.length: 0);
      this.totalRecords = this.lazyPaging ? this.totalRecords : (this.value ? this.value.length : 0);
      //first
      if (this.totalRecords && this.first >= this.totalRecords) {
        const numberOfPages = Math.ceil(this.totalRecords / this.rows);
        this.first = Math.max((numberOfPages - 1) * this.rows, 0);
      }
    }
  }

  paginate(event) {

    this.first = event.first;
    this.rows = event.rows;

    if (this.lazy) {
      this.stopFilterPropagation = true;
      this.onLazyLoad.emit(this.createLazyLoadMetadata());
    }
    else {
      this.updateDataToRender(this.filteredValue || this.value);
    }

    this.onPage.emit({
      first: this.first,
      rows: this.rows
    });
  }

  updateDataToRender(datasource) {
    if ((this.paginator || this.virtualScroll) && datasource) {
      this.dataToRender = [];
      // Mod by jins 20170614 分页相关，使用lazyPaging属性判断
      // let startIndex: number = this.lazy ? 0 : this.first;
      const startIndex: number = this.lazyPaging ? 0 : this.first;
      const endIndex: number = this.virtualScroll ? this.first + this.rows * 2 : startIndex + this.rows;

      for (let i = startIndex; i < endIndex; i++) {
        if (i >= datasource.length) {
          break;
        }

        this.dataToRender.push(datasource[i]);
      }
    }
    else {
      this.dataToRender = datasource;
    }

    if (this.rowGroupMode) {
      this.updateRowGroupMetadata();
    }

    this.loading = false;
  }

  onVirtualScroll(event) {
    this.loading = true;
    this.first = (event.page - 1) * this.rows;

    if (this.lazy) {
      this.stopFilterPropagation = true;
      this.onLazyLoad.emit(this.createLazyLoadMetadata());
    }
    else {
      this.updateDataToRender(this.filteredValue || this.value);
    }
  }

  onHeaderKeydown(event, column: Column) {
    if (event.keyCode == 13) {
      this.sort(event, column);
      event.preventDefault();
    }
  }

  onHeaderMousedown(event, header: any) {
    if (this.reorderableColumns) {
      if (event.target.nodeName !== 'INPUT') {
        header.draggable = true;
      } else if (event.target.nodeName === 'INPUT') {
        header.draggable = false;
      }
    }
  }

  sort(event, column: Column) {
    if (!column.sortable) {
      return;
    }

    const targetNode = event.target.nodeName;
    if (targetNode == 'TH' || (targetNode == 'SPAN' && !this.domHandler.hasClass(event.target, 'ui-c'))) {
      const columnSortField = column.sortField || column.field;
      this.sortOrder = (this.sortField === columnSortField)  ? this.sortOrder * -1 : 1;
      this.sortField = columnSortField;
      this.sortColumn = column;
      const metaKey = event.metaKey || event.ctrlKey;

      if (this.sortMode == 'multiple') {
        if (!this.multiSortMeta || !metaKey) {
          this.multiSortMeta = [];
        }

        this.addSortMeta({field: this.sortField, order: this.sortOrder});
      }

      if (this.lazy) {
        this.stopFilterPropagation = true;
        this.onLazyLoad.emit(this.createLazyLoadMetadata());
      }
      else {
        if (this.sortMode == 'multiple') {
          this.sortMultiple();
        }
        else {
          this.sortSingle();
        }
      }

      this.onSort.emit({
        field: this.sortField,
        order: this.sortOrder,
        multisortmeta: this.multiSortMeta
      });
    }
  }

  sortSingle() {
    if (this.value) {
      if (this.sortColumn && this.sortColumn.sortable === 'custom') {
        this.sortColumn.sortFunction.emit({
          field: this.sortField,
          order: this.sortOrder
        });
      }
      else {
        this.value.sort((data1, data2) => {
          const value1 = this.resolveFieldData(data1, this.sortField);
          const value2 = this.resolveFieldData(data2, this.sortField);
          let result = null;

          if (value1 == null && value2 != null)
            result = -1;
          else if (value1 != null && value2 == null)
            result = 1;
          else if (value1 == null && value2 == null)
            result = 0;
          else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
          else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

          return (this.sortOrder * result);
        });
      }

      // Mod by jins 20170614 有可能是在其他页过滤，所以此处
      // this.first = 0;
      if (!this.lazyPaging) {
        this.first = 0;
      }

      if (this.hasFilter()) {
        this._filter();
      }
    }

    //prevent resort at ngDoCheck
    this.stopSortPropagation = true;
  }

  sortMultiple() {
    if (this.value) {
      this.value.sort((data1, data2) => {
        return this.multisortField(data1, data2, this.multiSortMeta, 0);
      });

      if (this.hasFilter()) {
        this._filter();
      }
    }

    // prevent resort at ngDoCheck
    this.stopSortPropagation = true;
  }

  multisortField(data1, data2, multiSortMeta, index) {
    const value1 = this.resolveFieldData(data1, multiSortMeta[index].field);
    const value2 = this.resolveFieldData(data2, multiSortMeta[index].field);
    let result = null;

    if (typeof value1 == 'string' || value1 instanceof String) {
      if (value1.localeCompare && (value1 != value2)) {
        return (multiSortMeta[index].order * value1.localeCompare(value2));
      }
    }
    else {
      result = (value1 < value2) ? -1 : 1;
    }

    if (value1 == value2)  {
      return (multiSortMeta.length - 1) > (index) ? (this.multisortField(data1, data2, multiSortMeta, index + 1)) : 0;
    }

    return (multiSortMeta[index].order * result);
  }

  addSortMeta(meta) {
    let index = -1;
    for (let i = 0; i < this.multiSortMeta.length; i++) {
      if (this.multiSortMeta[i].field === meta.field) {
        index = i;
        break;
      }
    }

    if (index >= 0)
      this.multiSortMeta[index] = meta;
    else
      this.multiSortMeta.push(meta);
  }

  isSorted(column: Column) {
    if (!column.sortable) {
      return false;
    }

    const columnSortField = column.sortField || column.field;

    if (this.sortMode === 'single') {
      return (this.sortField && columnSortField === this.sortField);
    }
    else if (this.sortMode === 'multiple') {
      let sorted = false;
      if (this.multiSortMeta) {
        for (let i = 0; i < this.multiSortMeta.length; i++) {
          if (this.multiSortMeta[i].field == columnSortField) {
            sorted = true;
            break;
          }
        }
      }
      return sorted;
    }
  }

  getSortOrder(column: Column) {
    let order = 0;
    const columnSortField = column.sortField || column.field;

    if (this.sortMode === 'single') {
      if (this.sortField && columnSortField === this.sortField) {
        order = this.sortOrder;
      }
    }
    else if (this.sortMode === 'multiple') {
      if (this.multiSortMeta) {
        for (let i = 0; i < this.multiSortMeta.length; i++) {
          if (this.multiSortMeta[i].field == columnSortField) {
            order = this.multiSortMeta[i].order;
            break;
          }
        }
      }
    }
    return order;
  }

  onRowGroupClick(event) {
    if (this.rowGroupToggleClick) {
      this.rowGroupToggleClick = false;
      return;
    }

    if (this.sortableRowGroup) {
      const targetNode = event.target.nodeName;
      if ((targetNode == 'TD' || (targetNode == 'SPAN' && !this.domHandler.hasClass(event.target, 'ui-c')))) {
        if (this.sortField != this.groupField) {
          this.sortField = this.groupField;
          this.sortSingle();
        }
        else {
          this.sortOrder = -1 * this.sortOrder;
          this.sortSingle();
        }
      }
    }
  }

  handleRowClick(event, rowData) {
    const targetNode = event.target.nodeName;
    if (targetNode == 'TD' || (targetNode == 'SPAN' && !this.domHandler.hasClass(event.target, 'ui-c'))) {
      this.onRowClick.next({originalEvent: event, data: rowData});

      if (!this.selectionMode) {
        return;
      }

      const selected = this.isSelected(rowData);
      const metaSelection = this.rowTouched ? false : this.metaKeySelection;

      if (metaSelection) {
        const metaKey = event.metaKey || event.ctrlKey;

        if (selected && metaKey) {
          if (this.isSingleSelectionMode()) {
            this.selection = null;
            this.selectionChange.emit(null);
          }
          else {
            this.selection.splice(this.findIndexInSelection(rowData), 1);
            this.selectionChange.emit(this.selection);
          }

          this.onRowUnselect.emit({originalEvent: event, data: rowData, type: 'row'});
        }
        else {
          if (this.isSingleSelectionMode()) {
            this.selection = rowData;
            this.selectionChange.emit(rowData);
          }
          else if (this.isMultipleSelectionMode()) {
            if (metaKey)
              this.selection = this.selection || [];
            else
              this.selection = [];

            this.selection.push(rowData);
            this.selectionChange.emit(this.selection);
          }

          this.onRowSelect.emit({originalEvent: event, data: rowData, type: 'row'});
        }
      }
      else {
        if (this.isSingleSelectionMode()) {
          if (selected) {
            this.selection = null;
            this.onRowUnselect.emit({originalEvent: event, data: rowData, type: 'row'});
          }
          else {
            this.selection = rowData;
            this.onRowSelect.emit({originalEvent: event, data: rowData, type: 'row'});
          }
        }
        else {
          if (selected) {
            this.selection.splice(this.findIndexInSelection(rowData), 1);
            this.onRowUnselect.emit({originalEvent: event, data: rowData, type: 'row'});
          }
          else {
            this.selection = this.selection || [];
            this.selection.push(rowData);
            this.onRowSelect.emit({originalEvent: event, data: rowData, type: 'row'});
          }
        }

        this.selectionChange.emit(this.selection);
      }
    }

    this.rowTouched = false;
  }

  handleRowTouchEnd(event) {
    this.rowTouched = true;
  }

  selectRowWithRadio(event, rowData: any) {
    if (this.selection != rowData) {
      this.selection = rowData;
      this.selectionChange.emit(this.selection);
      this.onRowSelect.emit({originalEvent: event, data: rowData, type: 'radiobutton'});
    }
  }

  toggleRowWithCheckbox(event, rowData) {
    const selectionIndex = this.findIndexInSelection(rowData);
    this.selection = this.selection || [];

    if (selectionIndex != -1) {
      this.selection.splice(selectionIndex, 1);
      this.onRowUnselect.emit({originalEvent: event, data: rowData, type: 'checkbox'});
    }

    else {
      this.selection.push(rowData);
      this.onRowSelect.emit({originalEvent: event, data: rowData, type: 'checkbox'});
    }

    this.selectionChange.emit(this.selection);
  }

  toggleRowsWithCheckbox(event) {
    if (event.checked)
      this.selection = this.dataToRender.slice(0);
    else
      this.selection = [];

    this.selectionChange.emit(this.selection);

    this.onHeaderCheckboxToggle.emit({originalEvent: event, checked: event.checked});
  }

  onRowRightClick(event, rowData) {
    if (this.contextMenu) {
      const selectionIndex = this.findIndexInSelection(rowData);
      const selected = selectionIndex != -1;

      if (!selected) {
        if (this.isSingleSelectionMode()) {
          this.selection = rowData;
          this.selectionChange.emit(rowData);
        }
        else if (this.isMultipleSelectionMode()) {
          this.selection = [];
          this.selection.push(rowData);
          this.selectionChange.emit(this.selection);
        }
      }

      this.contextMenu.show(event);
      this.onContextMenuSelect.emit({originalEvent: event, data: rowData});
    }
  }

  rowDblclick(event, rowData) {
    this.onRowDblclick.emit({originalEvent: event, data: rowData});
  }

  isSingleSelectionMode() {
    return this.selectionMode === 'single';
  }

  isMultipleSelectionMode() {
    return this.selectionMode === 'multiple';
  }

  findIndexInSelection(rowData: any) {
    let index = -1;
    if (this.selection) {
      for (let i = 0; i  < this.selection.length; i++) {
        if (this.utilService.equals(rowData, this.selection[i])) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  isSelected(rowData) {

    return ((rowData && this.utilService.equals(rowData, this.selection)) || this.findIndexInSelection(rowData) != -1);
  }

  //单选判定行是否可以选中
  isDisabled(rowData){
    if (this.selDisabledCol != null && rowData[this.selDisabledCol] == true){
      return true;
    }else{
      return false;
    }
  }

  get allSelected() {
    let val = true;
    if (this.dataToRender && this.selection && (this.dataToRender.length <= this.selection.length)) {
      for (const data of this.dataToRender) {
        if (!this.isSelected(data)) {
          val = false;
          break;
        }
      }
    }
    else {
      val = false;
    }
    return val;
  }

  onFilterKeyup(value, field, matchMode) {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filter(value, field, matchMode);
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  filter(value, field, matchMode) {
    if (!this.isFilterBlank(value))
      this.filters[field] = {value: value, matchMode: matchMode};
    else if (this.filters[field])
      delete this.filters[field];

    this._filter();
  }

  isFilterBlank(filter: any): boolean {
    if (filter !== null && filter !== undefined) {
      if ((typeof filter === 'string' && filter.trim().length == 0) || (filter instanceof Array && filter.length == 0))
        return true;
      else
        return false;
    }
    return true;
  }

  _filter() {
    // Mod by jins 20170614 有可能在其他页面进行分页，所以此处注释掉
    // this.first = 0;
    if (!this.lazyPaging) {
      this.first = 0;
    }

    if (this.lazy) {
      this.stopFilterPropagation = true;
      this.onLazyLoad.emit(this.createLazyLoadMetadata());
    }
    else {
      this.filteredValue = [];

      for (let i = 0; i < this.value.length; i++) {
        let localMatch = true;
        let globalMatch = false;

        for (let j = 0; j < this.columns.length; j++) {
          const col = this.columns[j],
            filterMeta = this.filters[col.field];

          //local
          if (filterMeta) {
            const filterValue = filterMeta.value,
              filterField = col.field,
              filterMatchMode = filterMeta.matchMode || 'startsWith',
              dataFieldValue = this.resolveFieldData(this.value[i], filterField);
            const filterConstraint = this.filterConstraints[filterMatchMode];

            if (!filterConstraint(dataFieldValue, filterValue)) {
              localMatch = false;
            }

            if (!localMatch) {
              break;
            }
          }

          //global
          if (this.globalFilter && !globalMatch) {
            globalMatch = this.filterConstraints['contains'](this.resolveFieldData(this.value[i], col.field), this.globalFilter.value);
          }
        }

        let matches = localMatch;
        if (this.globalFilter) {
          matches = localMatch && globalMatch;
        }

        if (matches) {
          this.filteredValue.push(this.value[i]);
        }
      }

      if (this.filteredValue.length === this.value.length) {
        this.filteredValue = null;
      }

      if (this.paginator) {
        // Mod by jins 20170614 不是Lazy分页模式，才重新计算totalRecords
        // this.totalRecords = this.filteredValue ? this.filteredValue.length: this.value ? this.value.length: 0;
        if (!this.lazyPaging){
          this.totalRecords = this.filteredValue ? this.filteredValue.length : this.value ? this.value.length : 0;
        }
      }

      this.updateDataToRender(this.filteredValue || this.value);
    }

    this.onFilter.emit({
      filters: this.filters
    });
  }

  hasFilter() {
    let empty = true;
    for (const prop in this.filters) {
      if (this.filters.hasOwnProperty(prop)) {
        empty = false;
        break;
      }
    }

    return !empty || (this.globalFilter && this.globalFilter.value && this.globalFilter.value.trim().length);
  }

  onFilterInputClick(event) {
    event.stopPropagation();
  }

  filterConstraints = {

    startsWith(value, filter): boolean {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = filter.toLowerCase();
      return value.toString().toLowerCase().slice(0, filterValue.length) === filterValue;
    },

    contains(value, filter): boolean {
      if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    },

    endsWith(value, filter): boolean {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = filter.toString().toLowerCase();
      return value.toString().toLowerCase().indexOf(filterValue, value.toString().length - filterValue.length) !== -1;
    },

    equals(value, filter): boolean {
      if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value.toString().toLowerCase() == filter.toString().toLowerCase();
    },

    in(value, filter: any[]): boolean {
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      for (let i = 0; i < filter.length; i++) {
        if (filter[i] === value)
          return true;
      }

      return false;
    }
  };

  switchCellToEditMode(cell: any, column: Column, rowData: any) {
    if (!this.selectionMode && this.editable && column.editable) {
      if (cell != this.editingCell) {
        if (this.editingCell && this.domHandler.find(this.editingCell, '.ng-invalid.ng-dirty').length == 0) {
          this.domHandler.removeClass(this.editingCell, 'ui-cell-editing');
        }

        this.editingCell = cell;
        this.onEditInit.emit({column: column, data: rowData});
        this.domHandler.addClass(cell, 'ui-cell-editing');
        const focusable = this.domHandler.findSingle(cell, '.ui-cell-editor input');
        if (focusable) {
          setTimeout(() => this.renderer.invokeElementMethod(focusable, 'focus'), 100);
        }
      }
    }
  }

  switchCellToViewMode(element: any) {
    this.editingCell = null;
    const cell = this.findCell(element);
    this.domHandler.removeClass(cell, 'ui-cell-editing');
  }

  onCellEditorKeydown(event, column: Column, rowData: any, colIndex: number) {
    if (this.editable) {
      this.onEdit.emit({originalEvent: event, column: column, data: rowData});

      //enter
      if (event.keyCode == 13) {
        this.onEditComplete.emit({column: column, data: rowData});
        this.renderer.invokeElementMethod(event.target, 'blur');
        this.switchCellToViewMode(event.target);
        event.preventDefault();
      }

      //escape
      else if (event.keyCode == 27) {
        this.onEditCancel.emit({column: column, data: rowData});
        this.renderer.invokeElementMethod(event.target, 'blur');
        this.switchCellToViewMode(event.target);
        event.preventDefault();
      }

      //tab
      else if (event.keyCode == 9) {
        this.onEditComplete.emit({column: column, data: rowData});
        const currentCell = this.findCell(event.target);
        const row = currentCell.parentElement;
        let targetCell;

        if (event.shiftKey) {
          if (colIndex == 0) {
            const previousRow = row.previousElementSibling;
            if (previousRow) {
              targetCell = previousRow.lastElementChild;
            }
          }
          else {
            targetCell = row.children[colIndex - 1];
          }
        }
        else {
          if (colIndex == (row.children.length - 1)) {
            const nextRow = row.nextElementSibling;
            if (nextRow) {
              targetCell = nextRow.firstElementChild;
            }
          }
          else {
            targetCell = row.children[colIndex + 1];
          }
        }

        if (targetCell) {
          this.renderer.invokeElementMethod(targetCell, 'click');
          event.preventDefault();
        }
      }
    }
  }

  findCell(element) {
    let cell = element;
    while (cell.tagName != 'TD') {
      cell = cell.parentElement;
    }

    return cell;
  }

  initResizableColumns() {
    this.tbody = this.domHandler.findSingle(this.el.nativeElement, 'tbody.ui-datatable-data');
    this.resizerHelper = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-column-resizer-helper');
    this.fixColumnWidths();

    this.documentColumnResizeListener = this.renderer.listenGlobal('body', 'mousemove', (event) => {
      if (this.columnResizing) {
        this.onColumnResize(event);
      }
    });

    this.documentColumnResizeEndListener = this.renderer.listenGlobal('body', 'mouseup', (event) => {
      if (this.columnResizing) {
        this.columnResizing = false;
        this.onColumnResizeEnd(event);
      }
    });
  }

  initColumnResize(event) {
    const container = this.el.nativeElement.children[0];
    const containerLeft = this.domHandler.getOffset(container).left;
    this.resizeColumn = event.target.parentElement;
    this.columnResizing = true;
    this.lastResizerHelperX = (event.pageX - containerLeft);
  }

  onColumnResize(event) {
    const container = this.el.nativeElement.children[0];
    const containerLeft = this.domHandler.getOffset(container).left;
    this.domHandler.addClass(container, 'ui-unselectable-text');
    this.resizerHelper.style.height = container.offsetHeight + 'px';
    this.resizerHelper.style.top = 0 + 'px';
    if (event.pageX > containerLeft && event.pageX < (containerLeft + container.offsetWidth)) {
      this.resizerHelper.style.left = (event.pageX - containerLeft) + 'px';
    }

    this.resizerHelper.style.display = 'block';
  }

  onColumnResizeEnd(event) {
    const delta = this.resizerHelper.offsetLeft - this.lastResizerHelperX;
    const columnWidth = this.resizeColumn.offsetWidth;
    const newColumnWidth = columnWidth + delta;
    const minWidth = this.resizeColumn.style.minWidth || 15;

    // tslint:disable-next-line:radix
    if (columnWidth + delta > parseInt(minWidth)) {
      if (this.columnResizeMode === 'fit') {
        const nextColumn = this.resizeColumn.nextElementSibling;
        const nextColumnWidth = nextColumn.offsetWidth - delta;

        if (newColumnWidth > 15 && nextColumnWidth > 15) {
          this.resizeColumn.style.width = newColumnWidth + 'px';
          if (nextColumn) {
            nextColumn.style.width = nextColumnWidth + 'px';
          }

          if (this.scrollable) {
            const colGroup = this.domHandler.findSingle(this.el.nativeElement, 'colgroup.ui-datatable-scrollable-colgroup');
            const resizeColumnIndex = this.domHandler.index(this.resizeColumn);
            colGroup.children[resizeColumnIndex].style.width = newColumnWidth + 'px';

            if (nextColumn) {
              colGroup.children[resizeColumnIndex + 1].style.width = nextColumnWidth + 'px';
            }
          }
        }
      }
      else if (this.columnResizeMode === 'expand') {
        this.tbody.parentElement.style.width = this.tbody.parentElement.offsetWidth + delta + 'px';
        this.resizeColumn.style.width = newColumnWidth + 'px';
        const containerWidth = this.tbody.parentElement.style.width;

        if (this.scrollable) {
          this.scrollBarWidth = this.scrollBarWidth || this.domHandler.calculateScrollbarWidth();
          this.el.nativeElement.children[0].style.width = parseFloat(containerWidth) + this.scrollBarWidth + 'px';
          const colGroup = this.domHandler.findSingle(this.el.nativeElement, 'colgroup.ui-datatable-scrollable-colgroup');
          const resizeColumnIndex = this.domHandler.index(this.resizeColumn);
          colGroup.children[resizeColumnIndex].style.width = newColumnWidth + 'px';
        }
        else {
          this.el.nativeElement.children[0].style.width = containerWidth;
        }
      }

      this.onColResize.emit({
        element: this.resizeColumn,
        delta: delta
      });
    }

    this.resizerHelper.style.display = 'none';
    this.resizeColumn = null;
    this.domHandler.removeClass(this.el.nativeElement.children[0], 'ui-unselectable-text');
  }

  fixColumnWidths() {
    const columns = this.domHandler.find(this.el.nativeElement, 'th.ui-resizable-column');

    for (const col of columns) {
      col.style.width = col.offsetWidth + 'px';
    }
  }

  onColumnDragStart(event) {
    if (this.columnResizing) {
      event.preventDefault();
      return;
    }

    this.draggedColumn = this.findParentHeader(event.target);
    event.dataTransfer.setData('text', 'b'); // Firefox requires this to make dragging possible
  }

  onColumnDragover(event) {
    if (this.reorderableColumns && this.draggedColumn) {
      event.preventDefault();
      const iconWidth = this.domHandler.getHiddenElementOuterWidth(this.reorderIndicatorUp);
      const iconHeight = this.domHandler.getHiddenElementOuterHeight(this.reorderIndicatorUp);
      const dropHeader = this.findParentHeader(event.target);
      const container = this.el.nativeElement.children[0];
      const containerOffset = this.domHandler.getOffset(container);
      const dropHeaderOffset = this.domHandler.getOffset(dropHeader);

      if (this.draggedColumn != dropHeader) {
        const targetLeft =  dropHeaderOffset.left - containerOffset.left;
        const targetTop =  containerOffset.top - dropHeaderOffset.top;
        const columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;

        this.reorderIndicatorUp.style.top = dropHeaderOffset.top - containerOffset.top - (iconHeight - 1) + 'px';
        this.reorderIndicatorDown.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';

        if (event.pageX > columnCenter) {
          this.reorderIndicatorUp.style.left = (targetLeft + dropHeader.offsetWidth - Math.ceil(iconWidth / 2)) + 'px';
          this.reorderIndicatorDown.style.left = (targetLeft + dropHeader.offsetWidth - Math.ceil(iconWidth / 2)) + 'px';
          this.dropPosition = 1;
        }
        else {
          this.reorderIndicatorUp.style.left = (targetLeft - Math.ceil(iconWidth / 2)) + 'px';
          this.reorderIndicatorDown.style.left = (targetLeft - Math.ceil(iconWidth / 2)) + 'px';
          this.dropPosition = -1;
        }

        this.reorderIndicatorUp.style.display = 'block';
        this.reorderIndicatorDown.style.display = 'block';
      }
      else {
        event.dataTransfer.dropEffect = 'none';
      }
    }
  }

  onColumnDragleave(event) {
    if (this.reorderableColumns && this.draggedColumn) {
      event.preventDefault();
      this.reorderIndicatorUp.style.display = 'none';
      this.reorderIndicatorDown.style.display = 'none';
    }
  }

  onColumnDrop(event) {
    event.preventDefault();
    if (this.draggedColumn) {
      const dragIndex = this.domHandler.index(this.draggedColumn);
      const dropIndex = this.domHandler.index(this.findParentHeader(event.target));
      let allowDrop = (dragIndex != dropIndex);
      if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition === -1) || (dragIndex - dropIndex == 1 && this.dropPosition === 1))) {
        allowDrop = false;
      }

      if (allowDrop) {
        this.columns.splice(dropIndex, 0, this.columns.splice(dragIndex, 1)[0]);

        this.onColReorder.emit({
          dragIndex: dragIndex,
          dropIndex: dropIndex,
          columns: this.columns
        });
      }

      this.reorderIndicatorUp.style.display = 'none';
      this.reorderIndicatorDown.style.display = 'none';
      this.draggedColumn.draggable = false;
      this.draggedColumn = null;
      this.dropPosition = null;
    }
  }

  initColumnReordering() {
    this.reorderIndicatorUp = this.domHandler.findSingle(this.el.nativeElement.children[0], 'span.ui-datatable-reorder-indicator-up');
    this.reorderIndicatorDown = this.domHandler.findSingle(this.el.nativeElement.children[0], 'span.ui-datatable-reorder-indicator-down');
  }

  findParentHeader(element) {
    if (element.nodeName == 'TH') {
      return element;
    }
    else {
      let parent = element.parentElement;
      while (parent.nodeName != 'TH') {
        parent = parent.parentElement;
      }
      return parent;
    }
  }

  hasFooter() {
    if (this.footerColumnGroup) {
      return true;
    }
    else {
      if (this.columns) {
        for (let i = 0; i  < this.columns.length; i++) {
          if (this.columns[i].footer) {
            return true;
          }
        }
      }

    }
    return false;
  }

  isEmpty() {
    return !this.dataToRender || (this.dataToRender.length == 0);
  }

  createLazyLoadMetadata(): LazyLoadEvent {
    return {
      first: this.first,
      rows: this.virtualScroll ? this.rows * 2 : this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      filters: this.filters,
      globalFilter: this.globalFilter ? this.globalFilter.value : null,
      multiSortMeta: this.multiSortMeta
    };
  }

  toggleRow(row: any, event?: Event) {
    if (!this.expandedRows) {
      this.expandedRows = [];
    }

    const expandedRowIndex = this.findExpandedRowIndex(row);

    if (expandedRowIndex != -1) {
      this.expandedRows.splice(expandedRowIndex, 1);
      this.onRowCollapse.emit({
        originalEvent: event,
        data: row
      });
    }
    else {
      if (this.rowExpandMode === 'single') {
        this.expandedRows = [];
      }

      this.expandedRows.push(row);
      this.onRowExpand.emit({
        originalEvent: event,
        data: row
      });
    }

    if (event) {
      event.preventDefault();
    }
  }

  findExpandedRowIndex(row: any): number {
    let index = -1;
    if (this.expandedRows) {
      for (let i = 0; i < this.expandedRows.length; i++) {
        if (this.expandedRows[i] == row) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  isRowExpanded(row: any): boolean {
    return this.findExpandedRowIndex(row) != -1;
  }

  findExpandedRowGroupIndex(row: any): number {
    let index = -1;
    if (this.expandedRowsGroups && this.expandedRowsGroups.length) {
      for (let i = 0; i < this.expandedRowsGroups.length; i++) {
        const group = this.expandedRowsGroups[i];
        const rowGroupField = this.resolveFieldData(row, this.groupField);
        if (rowGroupField === group) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  isRowGroupExpanded(row: any): boolean {
    return this.findExpandedRowGroupIndex(row) != -1;
  }

  toggleRowGroup(event: Event, row: any): void {
    this.rowGroupToggleClick = true;
    const index = this.findExpandedRowGroupIndex(row);
    const rowGroupField = this.resolveFieldData(row, this.groupField);
    if (index >= 0) {
      this.expandedRowsGroups.splice(index, 1);
      this.onRowGroupCollapse.emit({
        originalEvent: event,
        group: rowGroupField
      });
    }
    else {
      this.expandedRowsGroups = this.expandedRowsGroups || [],
        this.expandedRowsGroups.push(rowGroupField);
      this.onRowGroupExpand.emit({
        originalEvent: event,
        group: rowGroupField
      });
    }
    event.preventDefault();
  }

  public reset() {
    this.sortField = null;
    this.sortOrder = 1;

    this.filteredValue = null;
    this.filters = {};

    if (this.paginator) {
      this.paginate({
        first: 0,
        rows: this.rows
      });
    }
    else {
      this.updateDataToRender(this.value);
    }
  }

  public resetNoPagenate() {
    this.sortField = null;
    this.sortOrder = 1;

    this.filteredValue = null;
    this.filters = {};

    if (this.paginator) {
      this.first = 0;
      this.rows = this.rows;

      // 不需要重新分页，否则查询两次
      // this.paginate({
      //   first: 0,
      //   rows: this.rows
      // });
    }
    else {
      this.updateDataToRender(this.value);
    }
  }

  public exportCSV() {
    const data = this.value;
    let csv = '';

    //headers
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].field) {
        csv += this.columns[i].header || this.columns[i].field;

        if (i < (this.columns.length - 1)) {
          csv += this.csvSeparator;
        }
      }
    }

    //body
    this.value.forEach((record, i) => {
      csv += '\n';
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].field) {
          csv += this.resolveFieldData(record, this.columns[i].field);

          if (i < (this.columns.length - 1)) {
            csv += this.csvSeparator;
          }
        }
      }
    });

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, this.exportFilename + '.csv');
    }
    else {
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', this.exportFilename + '.csv');
        link.click();
      }
      else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }
      document.body.removeChild(link);
    }
  }

  getBlockableElement(): HTMLElement {
    return this.el.nativeElement.children[0];
  }

  getRowStyleClass(rowData: any, rowIndex: number) {
    let styleClass = 'ui-widget-content';
    if (this.rowStyleClass) {
      const rowClass = this.rowStyleClass.call(this, rowData, rowIndex);
      if (rowClass) {
        styleClass += ' ' + rowClass;
      }
    }
    return styleClass;
  }

  visibleColumns() {
    return this.columns ? this.columns.filter(c => !c.hidden) : [];
  }

  get containerWidth() {
    if (this.scrollable) {
      if (this.scrollWidth) {
        return this.scrollWidth;
      }
      else if (this.frozenWidth && this.unfrozenWidth) {
        return parseFloat(this.frozenWidth) + parseFloat(this.unfrozenWidth) + 'px';
      }
    }
    else {
      return this.style ? this.style.width : null;
    }
  }

  /**
   * 服务器端导出
   */
  doServerExport(){
    if (this.onServerExport){
      this.onServerExport.emit();
    }
  }

  /**
   * 客户端导出
   */
  doClientExport(){
    if (this.onClientExport){
      this.onClientExport.emit();
    }
  }

  ngOnDestroy() {
    //remove event listener
    if (this.globalFilterFunction) {
      this.globalFilterFunction();
    }

    if (this.resizableColumns && this.documentColumnResizeListener && this.documentColumnResizeEndListener) {
      this.documentColumnResizeListener();
      this.documentColumnResizeEndListener();
    }

    if (this.columnsSubscription) {
      this.columnsSubscription.unsubscribe();
    }
  }
}

@NgModule({
  imports: [CommonModule, SharedModule, NuiPaginatorModule, FormsModule, InputTextModule],
  exports: [DataTable, SharedModule],
  declarations: [DataTable, DTRadioButton, DTCheckbox, ColumnHeaders, ColumnFooters, TableBody, ScrollableView, RowExpansionLoader]
})
export class NuiDataTableModule { }
