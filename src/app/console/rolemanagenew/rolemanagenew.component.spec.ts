import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RolemanagenewComponent} from './rolemanagenew.component';

describe('RolemanagenewComponent', () => {
  let component: RolemanagenewComponent;
  let fixture: ComponentFixture<RolemanagenewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RolemanagenewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolemanagenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
