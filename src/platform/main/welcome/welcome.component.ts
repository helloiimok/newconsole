import { Component, OnInit } from '@angular/core';

declare var document: any;

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.component.html',
  styles: []
})
export class WelcomeComponent implements OnInit {
  events: any[];
  _height: string;
  constructor() { }

  ngOnInit() {
        this.events = [
            {
                "title": "All Day Event",
                "start": "2016-01-01"
            },
            {
                "title": "Long Event",
                "start": "2016-01-07",
                "end": "2016-01-10"
            },
            {
                "title": "Repeating Event",
                "start": "2016-01-09T16:00:00"
            },
            {
                "title": "Repeating Event",
                "start": "2016-01-16T16:00:00"
            },
            {
                "title": "Conference",
                "start": "2016-01-11",
                "end": "2016-01-13"
            }
        ];
    }
  ngAfterViewInit() {
    //this.resize();
    // window.onresize = (()=> {
    //     this.resize()
    //     console.log("resize==========");
    // }
    // )
    let heightNum = document.documentElement.clientHeight -65-40;
    // let widthNum = document.documentElement.clientWidth-250-4;
   //this._height = "" + heightNum + "px";
    this._height = "100%";
  }

}
