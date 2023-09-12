import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSurveyPageComponent } from './edit-survey-page.component';

describe('EditSurveyPageComponent', () => {
  let component: EditSurveyPageComponent;
  let fixture: ComponentFixture<EditSurveyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSurveyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSurveyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
