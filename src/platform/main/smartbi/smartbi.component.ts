import {AfterViewInit, Component} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {SmartbiConfigService} from "./smartbi-config.service";

/**
 * 添加SmartBI集成
 */
@Component({
    selector: 'app-smartbi-dwfx',
    templateUrl: './smartbi.component.html',
  }
)
export class SmartbiComponent implements AfterViewInit {

  srcSafeUrl: SafeResourceUrl;
  param: any;

  constructor(private domSS: DomSanitizer,
              private route: ActivatedRoute,
              private smartbiConfig: SmartbiConfigService) {
    this.route.paramMap.subscribe((routeParam) => {
      this.param = routeParam ? JSON.parse(routeParam.get('param')) : null;

      // 菜单up_menu表入参和新控制台路由传参方法不同
      if (this.param && this.param.key) {
        const config = this.smartbiConfig.getConfig(this.param.key);
        if (config) {
          this.srcSafeUrl = this.domSS.bypassSecurityTrustResourceUrl(config.url);
        }
      }
    })

  }

  ngAfterViewInit() {
    // if (this.param && this.param.url) {
    //   this.srcSafeUrl = this.domSS.bypassSecurityTrustResourceUrl('http://10.1.26.120:18080/smartbi/vision/openresource.jsp?resid=Ie428818a0163917f917f965901647d00825912ab');
    // }
  }
}
