import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionStatisticsFeedbackComponent } from './question-statistics-feedback.component';

describe('QuestionStatisticsFeedbackComponent', () => {
  let component: QuestionStatisticsFeedbackComponent;
  let fixture: ComponentFixture<QuestionStatisticsFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionStatisticsFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionStatisticsFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
