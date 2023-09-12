import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyStatisticsComponent } from './survey-statistics.component';

describe('SurveyStatisticsComponent', () => {
  let component: SurveyStatisticsComponent;
  let fixture: ComponentFixture<SurveyStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
