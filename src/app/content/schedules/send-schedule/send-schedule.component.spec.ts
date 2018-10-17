import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendScheduleComponent } from './send-schedule.component';

describe('SendScheduleComponent', () => {
  let component: SendScheduleComponent;
  let fixture: ComponentFixture<SendScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
