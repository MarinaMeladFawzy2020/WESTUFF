import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionaireOverAllFeedbackComponent } from './questionaire-over-all-feedback.component';

describe('QuestionaireOverAllFeedbackComponent', () => {
  let component: QuestionaireOverAllFeedbackComponent;
  let fixture: ComponentFixture<QuestionaireOverAllFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionaireOverAllFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionaireOverAllFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
