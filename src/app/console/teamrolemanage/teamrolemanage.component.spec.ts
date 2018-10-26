import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamrolemanageComponent } from './teamrolemanage.component';

describe('TeamrolemanageComponent', () => {
  let component: TeamrolemanageComponent;
  let fixture: ComponentFixture<TeamrolemanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamrolemanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamrolemanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
