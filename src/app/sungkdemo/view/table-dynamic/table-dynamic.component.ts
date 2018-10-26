import {Component, OnInit} from '@angular/core';
import {CarService} from '../../../demo/service/carservice';
import {Car} from '../../../demo/domain/car';
import {Message} from 'primeng/primeng';

@Component({
  selector: 'app-table-dynamic',
  templateUrl: './table-dynamic.component.html',
  styleUrls: ['./table-dynamic.component.css']
})
export class TableDynamicComponent implements OnInit {
  msgs: Message[];
  cars: Car[];
  cols: any[];
  cols_name: any[];
  selectedCars2: any[];
  un_cols: any[] = [];

  constructor(private carService: CarService) {

  }

  ngOnInit() {
    this.carService.getCarsSmall().then(cars => this.cars = cars);
    this.cols = [
      {field: 'vin', header: 'Vin'},
      {field: 'year', header: 'Year'},
      {field: 'brand', header: 'Brand'},
      {field: 'color', header: 'Color'}
    ];

    this.cols_name = [
      {col_name: 'vin'},
      {col_name: 'year'},
      {col_name: 'brand'},
      {col_name: 'color'}
    ]
    this.un_cols = [
      {field: 'vin', header: 'Vin'},
      {field: 'year', header: 'Year'},
      {field: 'brand', header: 'Brand'},
      {field: 'color', header: 'Color'}
    ];
  }

  handleClick = ($event) => {
    this.cols = [
      {field: 'vin', header: 'Vin'},
      {field: 'year', header: 'Year'},
      {field: 'brand', header: 'Brand'}
    ];
  }
  recovery = ($event) => {
    this.cols = [
      {field: 'vin', header: 'Vin'},
      {field: 'year', header: 'Year'},
      {field: 'brand', header: 'Brand'},
      {field: 'color', header: 'Color'}
    ];
  }

  onRowSelect(event) {
    // debugger ;
    // alert(this.selectedCars2.length);
    // this.msgs = [];
    // this.msgs.push({severity: 'info', summary: 'Car Selected', detail: event.data.col_name + ' - ' + event.data.brand});
  }

  onRowUnselect(event) {
    // debugger;

    // this.un_cols.push({field: event.data.field, header: ''});
    // this.un_cols.push(event.data);
    // this.msgs = [];
    // this.msgs.push({severity: 'info', summary: 'Car Unselected', detail: event.data.col_name + ' - ' + event.data.brand});
  }

  add = () => {
    // alert('hehe');
    this.cars.push({vin: 'heeh', year: 2019, brand: 'aaa', color: 'yello'});
  }

}
