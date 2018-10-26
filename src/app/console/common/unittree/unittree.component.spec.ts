import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnittreeComponent } from './unittree.component';

describe('UnittreeComponent', () => {
  let component: UnittreeComponent;
  let fixture: ComponentFixture<UnittreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnittreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnittreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
