import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSetupComponent } from './create-setup.component';

describe('CreateSetupComponent', () => {
  let component: CreateSetupComponent;
  let fixture: ComponentFixture<CreateSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
