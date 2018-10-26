import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProvbathComponent} from './provbath.component';

describe('ProvbathComponent', () => {
  let component: ProvbathComponent;
  let fixture: ComponentFixture<ProvbathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProvbathComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvbathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
