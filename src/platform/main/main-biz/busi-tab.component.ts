import {
  Component, OnInit, Input, AfterContentInit, ViewChild, ViewContainerRef, ComponentRef,
  OnChanges, OnDestroy, SimpleChanges
} from "@angular/core";
import {TabItem} from "./main-tab.service";
import {ModuleLoaderService} from "../login/module-loader.service";
/**
 * Created by jins on 2017/4/6.
 */

@Component({
  selector: 'busi-tab',
  template: `
	    <div #target>
	    </div>
`,
  styleUrls: []
})

export class BusiTabComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {

  @Input() tab: TabItem;

  @ViewChild('target', { read: ViewContainerRef }) viewContainerRef;

  @Input() metaData: any;

  cmpRef: ComponentRef<any>;

  private isViewInitialized: boolean = false;


  // refInjector: ReflectiveInjector;
  // resolverSub: Subscription;
  // componentFactoryResolver: ComponentFactoryResolver;
  // injector: Injector;


  constructor(private lazyLoad: ModuleLoaderService) { }

  updateComponent() {
    if (!this.isViewInitialized) {
      return;
    }
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }

    // const componentType = this.getComponentTypeByName(this.tab.component);
    const componentFactory = this.lazyLoad.getComponentFactory(this.tab.componentName);
    this.cmpRef = this.viewContainerRef.createComponent(componentFactory, 0);
    // 如果有参数，则传入参数
    if(this.tab.param){
      this.cmpRef.instance.param = JSON.parse(this.tab.param);
    }
  }

  ngOnInit() {
    // this.resolverSub = this.lazyLoad.contextReceived$.subscribe(resolver => {
    //   debugger;
    //   this.componentFactoryResolver = resolver.resolver;
    //   this.injector = resolver.injector;
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    this.updateComponent();
  }

  ngAfterContentInit() {
    // debugger;
    this.isViewInitialized = true;
    this.updateComponent();
  }

  ngOnDestroy() {
    // debugger;
    // this.resolverSub.unsubscribe();
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }

  // getComponentTypeByName(name: any){
  //   let result = null;
  //   if(name) {
  //     debugger;
  //     const factories = Array.from(this.componentFactoryResolver['_factories'].keys());
  //     result = <Type<any>>factories.find((x: any) => x.name === name);
  //   }
  //   return result;
  // }


}
