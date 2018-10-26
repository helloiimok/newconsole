import {Component, OnInit} from '@angular/core';
import {Car} from '../../../demo/domain/car';
import {CarService} from '../../../demo/service/carservice';
import {MenuItem, Message, TreeNode} from 'primeng/primeng';
import {NodeService} from '../../../demo/service/nodeservice';
import {allowPreviousPlayerStylesMerge} from '@angular/animations/browser/src/util';
import {detectBufferEncoding} from 'tslint/lib/utils';
import {TestService} from "../imok-test/testService";
import {forEach} from "@angular/router/src/utils/collection";
import {isNull} from "util";

@Component({
  selector: 'app-grid-crdu',
  templateUrl: './grid-crdu.component.html',
  styleUrls: ['./grid-crdu.component.css']
})
export class GridCrduComponent implements OnInit {

  msgs: Message[];
  files1: TreeNode[];
  files2: TreeNode[];
  files3: any[] = [];
  items: MenuItem[];
  selectedFile2: TreeNode;

  displayDialog: boolean;

  car: Car = new PrimeCar();

  selectedCar: Car;

  newCar: boolean;

  cars: Car[];

  menuForm: MenuForm = {title:'',url:'',parameters:'',order_num:'',component:''};

  constructor(private carService: CarService,
              private nodeService: NodeService,
              private testService: TestService) {
  }

  ngOnInit() {
    // this.carService.getCarsSmall().then(cars => this.cars = cars);
    this.cars = [];
    this.cars.push({vin: 0, year: 2018, brand: 'aaa', color: 'white'});
    this.nodeService.getFilesystem().then(files => this.files1 = files);
    this.nodeService.getFiles().then(files => this.files2 = files);

    this.items = [
      {label: 'View', icon: 'fa-search', command: (event) => this.viewFile(this.selectedFile2)},
      {label: 'Unselect', icon: 'fa-close', command: (event) => this.unselectFile()}
    ];
  }

  showDialogToAdd() {
    this.newCar = true;
    this.car = new PrimeCar();
    this.displayDialog = true;
  }

  save() {
    const cars = [...this.cars];
    if (this.newCar)
      cars.push(this.car);
    else
      cars[this.findSelectedCarIndex()] = this.car;

    this.cars = cars;
    this.car = null;
    this.displayDialog = false;
  }

  delete() {
    const index = this.findSelectedCarIndex();
    this.cars = this.cars.filter((val, i) => i != index);
    this.car = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newCar = false;
    this.car = this.cloneCar(event.data);
    this.displayDialog = true;
  //  更新显示form的菜单信息


  }

  cloneMenu(c: any): any {
    const menu = {};
    for (const prop in c) {
      menu[prop] = c[prop];
    }
    return menu;
  }

  cloneCar(c: Car): Car {
    const car = new PrimeCar();
    for (const prop in c) {
      car[prop] = c[prop];
    }
    return car;
  }

  findSelectedCarIndex(): number {
    return this.cars.indexOf(this.selectedCar);
  }

  viewFile(file: TreeNode) {
    debugger;
    this.msgs = [];
    const cars = [...this.cars];
    const car: Car = this.cloneCar(new PrimeCar(this.selectedFile2.label, this.selectedFile2.data, 'ooo', 'yello'));
    cars.push(car);
    this.cars = cars;

    this.msgs.push({severity: 'info', summary: 'Node Selected with Right Click', detail: file.label});

  }

  unselectFile() {
    // this.files3.pop({'data': this.selectedFile2});
    this.selectedFile2 = null;
  }
  private successFunc: any = (
    response => {
      // 成功回调
      debugger;
      // 数据源表的下拉列表赋值
      let menuArray: TreeNode ={};
      let res = response.body.resultList.data;
      res = this.testService.transToLowerKeyArray(res);
      this.files2.pop();
      this.files2 = [];
      let menuList: TreeNode[] =[];

      res.forEach(function(value,i){
        let nodeMenu: TreeNode = {};
        nodeMenu['label'] = value['title'];
        nodeMenu['data'] = value;
        nodeMenu['children'] = [];
        nodeMenu['icon'] = "fa-file-image-o";
        // nodeMenu['expandedIcon'] = "fa-folder-open";
        // nodeMenu['collapsedIcon'] = "fa-folder";
        nodeMenu['id'] = value['id'];
        // nodeMenu['parent_id'] = value['parent_id'];
        // 判断id和parent_id
        if (value['parent_id'] != null && value['parent_id'] != ""){
            menuList.forEach(function (val,i){
              if (val['id'] == value['parent_id']){
                val['children'].push(nodeMenu);
                val['expandedIcon'] = "fa-folder-open";
                val['collapsedIcon'] = "fa-folder";
                val['icon'] = "";
              }

              if(val['id']=='menuManager'){
                menuArray = val;
              }
            });
        }

        menuList.push(nodeMenu);
      });
      this.files2.push(menuArray);

    }
  );
  test = () => {

    const cars = [...this.cars];
    const car: Car = this.cloneCar(new PrimeCar('imok', 2017, 'ooo', 'yello'));
    cars.push(car);
    this.cars = cars;

  }

  readMenu = () => {
    debugger;
    this.testService.queryUserTest({},this.successFunc);
  }

  nodeSelect = (event) => {
    debugger;
    // if (event.node.children) {
    //   return;
    // }
    const item = event.node.data;

    // const cars = [...this.cars];
    const cars = [];
    const car: any = this.cloneMenu(item);
    cars.push(car);
    this.cars = cars;
  //  同步显示form
    this.menuForm = item;

  }
}

class PrimeCar implements Car {

  constructor(public vin?, public year?, public brand?, public color?) {
    this.vin = vin ? vin : '0';
    this.year = year ? year : 2018;
    this.brand = brand ? brand : 'brand';
    this.color = color ? color : 'yello';
  }
}
export interface MenuForm {
  title?;
  url?;
  order_num?;
  component?;
  parameters?;
}
