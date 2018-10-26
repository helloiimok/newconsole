import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GrantmenutoprovComponent} from './grantmenutoprov.component';

describe('GrantmenutoprovComponent', () => {
  let component: GrantmenutoprovComponent;
  let fixture: ComponentFixture<GrantmenutoprovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GrantmenutoprovComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantmenutoprovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
