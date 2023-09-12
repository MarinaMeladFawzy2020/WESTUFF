import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsStatisticsComponent } from './questions-statistics.component';

describe('QuestionsStatisticsComponent', () => {
  let component: QuestionsStatisticsComponent;
  let fixture: ComponentFixture<QuestionsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
