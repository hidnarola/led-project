import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSetupComponent } from './edit-setup.component';

describe('EditSetupComponent', () => {
  let component: EditSetupComponent;
  let fixture: ComponentFixture<EditSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
