import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TeammenuComponent} from './teammenu.component';

describe('TeammenuComponent', () => {
  let component: TeammenuComponent;
  let fixture: ComponentFixture<TeammenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeammenuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeammenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
