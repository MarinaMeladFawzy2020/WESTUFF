import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionsModalComponent } from './survey-questions-modal.component';

describe('SurveyQuestionsModalComponent', () => {
  let component: SurveyQuestionsModalComponent;
  let fixture: ComponentFixture<SurveyQuestionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyQuestionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyQuestionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
