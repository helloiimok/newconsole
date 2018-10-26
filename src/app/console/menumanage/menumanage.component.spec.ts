import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenumanageComponent } from './menumanage.component';

describe('MenumanageComponent', () => {
  let component: MenumanageComponent;
  let fixture: ComponentFixture<MenumanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenumanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenumanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
