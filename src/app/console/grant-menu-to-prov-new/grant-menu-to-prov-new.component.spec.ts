import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GrantMenuToProvNewComponent} from './grant-menu-to-prov-new.component';

describe('GrantMenuToProvNewComponent', () => {
  let component: GrantMenuToProvNewComponent;
  let fixture: ComponentFixture<GrantMenuToProvNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GrantMenuToProvNewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantMenuToProvNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
