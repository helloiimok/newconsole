import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Teammenu2Component} from './teammenu-2.component';

describe('Teammenu2Component', () => {
  let component: Teammenu2Component;
  let fixture: ComponentFixture<Teammenu2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Teammenu2Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Teammenu2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
