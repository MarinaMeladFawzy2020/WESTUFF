import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionslistComponent } from './questionslist.component';

describe('QuestionslistComponent', () => {
  let component: QuestionslistComponent;
  let fixture: ComponentFixture<QuestionslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
