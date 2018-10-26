import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecttreeComponent } from './selecttree.component';

describe('SelecttreeComponent', () => {
  let component: SelecttreeComponent;
  let fixture: ComponentFixture<SelecttreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecttreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecttreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
