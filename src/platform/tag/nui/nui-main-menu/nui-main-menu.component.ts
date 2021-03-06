import {
  NgModule,
  Component,
  ElementRef,
  OnDestroy,
  Input,
  EventEmitter,
  trigger,
  state,
  transition,
  style,
  animate
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MenuItem} from "primeng/primeng";

export class BasePanelMenuItem {

  constructor(public router: Router) {
  }

  handleClick(event, item) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    item.expanded = !item.expanded;

    if (!item.url || item.routerLink) {
      event.preventDefault();
    }

    if (item.command) {
      if (!item.eventEmitter) {
        item.eventEmitter = new EventEmitter();
        item.eventEmitter.subscribe(item.command);
      }

      item.eventEmitter.emit({
        originalEvent: event,
        item: item
      });
    }

    if (item.routerLink) {
      this.router.navigate(item.routerLink);
    }
  }
}

@Component({
  selector: 'nui-main-menu-sub',
  template: `
    <ul class="ui-menu-list ui-helper-reset" [style.display]="expanded ? 'block' : 'none'">
      <li *ngFor="let child of item.items" class="ui-menuitem ui-corner-all" [ngClass]="{'ui-menu-parent':child.items}">
        <a [href]="child.url||'#'" class="ui-menuitem-link ui-corner-all" 
           [ngClass]="{'ui-menuitem-link-hasicon':child.icon&&child.items,'ui-state-disabled':child.disabled}"
           (click)="handleClick($event,child)" [attr.target]="child.target" title="{{child.label}}">
                    <span class="ui-panelmenu-icon fa fa-fw"
                          [ngClass]="{'fa-caret-right':!child.expanded,'fa-caret-down':child.expanded}"
                          *ngIf="child.items"></span
                    ><span class="ui-menuitem-icon fa fa-fw" [ngClass]="child.icon" *ngIf="child.icon"></span
        ><span class="ui-menuitem-text" >{{child.label}}</span>
        </a>
        <nui-main-menu-sub [item]="child" [expanded]="child.expanded" *ngIf="child.items"></nui-main-menu-sub>
      </li>
    </ul>
  `
})
export class NuiMainMenuSub extends BasePanelMenuItem {

  @Input() item: MenuItem;

  @Input() expanded: boolean;

  constructor(router: Router) {
    super(router);
  }
}

@Component({
  selector: 'nui-main-menu',
  template: `
    <div [class]="styleClass" [ngStyle]="style" [ngClass]="'ui-panelmenu ui-widget'">
      <div *ngFor="let item of model;let f=first;let l=last;" class="ui-panelmenu-panel">
        <div tabindex="0" [ngClass]="{'ui-widget ui-panelmenu-header ui-state-default':true,'ui-corner-top':f,'ui-corner-bottom':l&&!item.expanded,
                    'ui-state-active':item.expanded,'ui-state-disabled':item.disabled}">
          <a [href]="item.url||'#'" [ngClass]="{'ui-panelmenu-headerlink-hasicon':item.icon}"
             (click)="handleClick($event,item)"
             [attr.target]="item.target"   title="{{item.label}}">
                        <!--<span class="ui-menuitem-icon fa" [ngClass]="item.icon" *ngIf="item.icon"></span>-->
                        <img src="{{item.icon}}" style="vertical-align: middle;">
                        <span class="ui-menuitem-text"  >{{item.label}}</span>
                        <span *ngIf="item.items" class="ui-panelmenu-icon fa"
                  [ngClass]="{'fa-caret-down':!item.expanded,'fa-caret-up':item.expanded}"></span></a>
        </div>
        <div *ngIf="item.items" class="ui-panelmenu-content-wrapper" [@rootItem]="item.expanded ? 'visible' : 'hidden'"
             [ngClass]="{'ui-panelmenu-content-wrapper-overflown': !item.expanded||animating}">
          <div class="ui-panelmenu-content ui-widget-content">
            <nui-main-menu-sub [item]="item" [expanded]="true"></nui-main-menu-sub>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('rootItem', [
      state('hidden', style({
        height: '0px'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class NuiMainMenu extends BasePanelMenuItem {

  @Input() model: MenuItem[];

  @Input() style: any;

  @Input() styleClass: string;

  public animating: boolean;

  constructor(router: Router) {
    super(router);
  }

  unsubscribe(item: any) {
    if (item.eventEmitter) {
      item.eventEmitter.unsubscribe();
    }

    if (item.items) {
      for (let childItem of item.items) {
        this.unsubscribe(childItem);
      }
    }
  }

  ngOnDestroy() {
    if (this.model) {
      for (let item of this.model) {
        this.unsubscribe(item);
      }
    }
  }

  handleClick(event, item) {
    this.animating = true;
    super.handleClick(event, item);
    //TODO: Use onDone of animate callback instead with RC6
    setTimeout(() => {
      this.animating = false;
    }, 400);
  }

}
