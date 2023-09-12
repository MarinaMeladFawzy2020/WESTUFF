import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSurveyStatisticsComponent } from './view-survey-statistics.component';

describe('ViewSurveyStatisticsComponent', () => {
  let component: ViewSurveyStatisticsComponent;
  let fixture: ComponentFixture<ViewSurveyStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSurveyStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSurveyStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
