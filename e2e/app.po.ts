import { browser } from 'protractor';

export class PoseidonPage {
  navigateTo() {
    return browser.get('/');
  }
}
