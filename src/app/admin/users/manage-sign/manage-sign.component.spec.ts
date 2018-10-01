import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSignComponent } from './manage-sign.component';

describe('ManageSignComponent', () => {
  let component: ManageSignComponent;
  let fixture: ComponentFixture<ManageSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
