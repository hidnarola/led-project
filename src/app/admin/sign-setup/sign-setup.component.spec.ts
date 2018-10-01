import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignSetupComponent } from './sign-setup.component';

describe('SignSetupComponent', () => {
  let component: SignSetupComponent;
  let fixture: ComponentFixture<SignSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
