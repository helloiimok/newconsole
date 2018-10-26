import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImokTestComponent } from './imok-test.component';

describe('ImokTestComponent', () => {
  let component: ImokTestComponent;
  let fixture: ComponentFixture<ImokTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImokTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImokTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
