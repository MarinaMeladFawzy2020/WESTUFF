import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTopicComponent } from './notification-topic.component';

describe('NotificationTopicComponent', () => {
  let component: NotificationTopicComponent;
  let fixture: ComponentFixture<NotificationTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
