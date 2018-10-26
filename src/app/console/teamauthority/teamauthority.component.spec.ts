import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamauthorityComponent } from './teamauthority.component';

describe('TeamauthorityComponent', () => {
  let component: TeamauthorityComponent;
  let fixture: ComponentFixture<TeamauthorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamauthorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamauthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
