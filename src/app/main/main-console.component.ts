import {Component, AfterViewInit, ElementRef, Renderer, ViewChild, OnDestroy} from '@angular/core';
import {LoginService} from "../../platform/main/login/login.service";

enum MenuOrientation {
  STATIC,
  OVERLAY,
  HORIZONTAL
};

declare var jQuery: any;
// 20180720 jins 新控制台集成SmartBI 添加高度控制
declare var document: any;

@Component({
  selector: 'app-main-console',
  templateUrl: './main-console.component.html'
})
export class MainConsoleComponent implements AfterViewInit, OnDestroy {

  layoutCompact = false;

  layoutMode: MenuOrientation = MenuOrientation.STATIC;

  rotateMenuButton: boolean;

  topbarMenuActive: boolean;

  overlayMenuActive: boolean;

  staticMenuDesktopInactive: boolean;

  staticMenuMobileActive: boolean;

  layoutContainer: HTMLDivElement;

  layoutMenuScroller: HTMLDivElement;

  modal: HTMLDivElement;

  menuClick: boolean;

  topbarItemClick: boolean;

  activeTopbarItem: any;

  documentClickListener: Function;

  resetMenu: boolean;
  // 20180720 jins 新控制台集成SmartBI
  mainHeight: string;

  @ViewChild('layoutWrapper') layourContainerViewChild: ElementRef;

  @ViewChild('layoutMenuScroller') layoutMenuScrollerViewChild: ElementRef;

  constructor(public renderer: Renderer,
              private loginService: LoginService) {
    this.loginService.checkLogin();
    // 20180720 jins 新控制台集成SmartBI
    this.mainHeight = document.documentElement.clientHeight - 65 + 'px';
  }

  ngAfterViewInit() {
    this.layoutContainer = <HTMLDivElement> this.layourContainerViewChild.nativeElement;
    this.layoutMenuScroller = <HTMLDivElement> this.layoutMenuScrollerViewChild.nativeElement;

    // hides the horizontal submenus or top menu if outside is clicked
    this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
      if (!this.topbarItemClick) {
        this.activeTopbarItem = null;
        this.topbarMenuActive = false;
      }

      if (!this.menuClick && this.isHorizontal()) {
        this.resetMenu = true;
      }

      this.topbarItemClick = false;
      this.menuClick = false;
    });

    setTimeout(() => {
      jQuery(this.layoutMenuScroller).nanoScroller({flash: true});
    }, 10);
  }

  onMenuButtonClick(event) {
    this.rotateMenuButton = !this.rotateMenuButton;
    this.topbarMenuActive = false;

    if (this.layoutMode === MenuOrientation.OVERLAY) {
      this.overlayMenuActive = !this.overlayMenuActive;
    } else {
      if (this.isDesktop()) {
        this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
      } else {
        if (this.staticMenuMobileActive) {
          this.staticMenuMobileActive = false;
        } else {
          this.staticMenuMobileActive = true;
        }
      }
    }

    event.preventDefault();
  }

  onMenuClick($event) {
    this.menuClick = true;
    this.resetMenu = false;

    if (!this.isHorizontal()) {
      setTimeout(() => {
        jQuery(this.layoutMenuScroller).nanoScroller();
      }, 500);
    }
  }

  onTopbarMenuButtonClick(event) {
    this.topbarItemClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;

    if (this.overlayMenuActive || this.staticMenuMobileActive) {
      this.rotateMenuButton = false;
      this.overlayMenuActive = false;
      this.staticMenuMobileActive = false;
    }

    event.preventDefault();
  }

  onTopbarItemClick(event, item) {
    this.topbarItemClick = true;

    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null;
    } else {
      this.activeTopbarItem = item;
    }

    event.preventDefault();
  }

  isTablet() {
    const width = window.innerWidth;
    return width <= 1024 && width > 640;
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  isMobile() {
    return window.innerWidth <= 640;
  }

  isOverlay() {
    return this.layoutMode === MenuOrientation.OVERLAY;
  }

  isHorizontal() {
    return this.layoutMode === MenuOrientation.HORIZONTAL;
  }

  changeToStaticMenu() {
    this.layoutMode = MenuOrientation.STATIC;
  }

  changeToOverlayMenu() {
    this.layoutMode = MenuOrientation.OVERLAY;
  }

  changeToHorizontalMenu() {
    this.layoutMode = MenuOrientation.HORIZONTAL;
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }

    jQuery(this.layoutMenuScroller).nanoScroller({flash: true});
  }

}
