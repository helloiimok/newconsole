import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TeamauthoritygroupComponent} from './teamauthoritygroup.component';

describe('TeamauthoritygroupComponent', () => {
  let component: TeamauthoritygroupComponent;
  let fixture: ComponentFixture<TeamauthoritygroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeamauthoritygroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamauthoritygroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
