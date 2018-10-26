import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'password'})
export class PasswordPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    if (typeof value !== 'string') {
      throw new Error('Invalid pipe argument for WelcomePipe');
    }
    // 将value按照长度替换为相应的*号显示出来
    let sp = '';
    for (let i = 0; i < value.length; i++) {
      sp += '*';
    }
    return sp;
  }
}
