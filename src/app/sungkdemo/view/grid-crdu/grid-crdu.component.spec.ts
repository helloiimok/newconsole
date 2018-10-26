import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GridCrduComponent} from './grid-crdu.component';

describe('GridCrduComponent', () => {
  let component: GridCrduComponent;
  let fixture: ComponentFixture<GridCrduComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GridCrduComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCrduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
