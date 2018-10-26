import {Component, OnInit} from "@angular/core";
import {LoginService} from "./login.service";

@Component({
  selector: 'app-login-use-cas',
  template: ' ',
  styles: []
})

export class LoginUseCASComponent implements OnInit{

  constructor(private loginService: LoginService){

  }

  ngOnInit(){
    this.loginService.loginUseCAS();
  }
}
