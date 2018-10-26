import {
  ComponentFactoryResolver, Injectable, Injector, NgModuleFactory, SystemJsNgModuleLoader,
  Type
} from "@angular/core";
import {SystemSetting} from "../../system-setting/system-setting";
import {NuiMenuNode} from "../menu/menu.service";

@Injectable()
export class ModuleLoaderService {

  private blocked = false;

  private componentResolverAll: ComponentFactoryResolver[];

  constructor(private loader: SystemJsNgModuleLoader,
              private inj: Injector,
              public sys: SystemSetting,
              private currentComponentFactory: ComponentFactoryResolver){
    this.componentResolverAll = [];
    this.componentResolverAll.push(this.currentComponentFactory);
  }

  lazyLoadStart(){
    // this.load('./biz/modules/object.modules.ts#BizObjectModule');
    // this.load('./biz/modules/demo.modules.ts#BizDemoModule');
    // this.load('./biz/modules/fincial.modules.ts#BizFincialModule');
    // this.load('./biz/modules/manager.modules.ts#BizManagerModule');
    // this.load('./biz/modules/other.modules.ts#BizOtherModule');
    // this.load('./biz/modules/poor-main.modules.ts#BizPoorMainModule');
    // this.load('./biz/modules/project.modules.ts#BizProjectModule');
    // this.load('./biz/modules/query.modules.ts#BizQueryModule');
    // this.load('./biz/modules/statis.modules.ts#BizStatisModule');
  }

  load(selectedNode: NuiMenuNode, callFunc: any){
    this.blocked = true;
    this.loader.load(selectedNode.moduleUrl).then((moduleFactory: NgModuleFactory<any>) => {
        this.blocked = false;
        const moduleRef = moduleFactory.create(this.inj);
        this.componentResolverAll.push(moduleRef.componentFactoryResolver);
        // debugger;
        if(callFunc){
          callFunc(selectedNode);
        }
      }
    ).catch(
      (response: any) => {
        this.blocked = false;
        console.log(response);
      }
    );
  }

  getComponentFactory(componentName: string){
    let compFactory = null;

    for(let resolver of this.componentResolverAll){
      // 查找Component
      const factories = Array.from(resolver['_factories'].keys());
      const componetType = <Type<any>>factories.find((x: any) =>    {
        return x.name === componentName;
        }
      );
      if(componetType) {
        compFactory = resolver.resolveComponentFactory(componetType);
        break;
      }
    }

    return compFactory;
  }
  getBlocked(){
    return this.blocked;
  }
}
