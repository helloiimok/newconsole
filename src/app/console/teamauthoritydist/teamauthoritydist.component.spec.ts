import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TeamauthoritydistComponent} from './teamauthoritydist.component';

describe('TeamauthoritydistComponent', () => {
  let component: TeamauthoritydistComponent;
  let fixture: ComponentFixture<TeamauthoritydistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeamauthoritydistComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamauthoritydistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
