import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalTopicCategoryComponent } from './add-medical-topic-category.component';

describe('AddMedicalTopicCategoryComponent', () => {
  let component: AddMedicalTopicCategoryComponent;
  let fixture: ComponentFixture<AddMedicalTopicCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMedicalTopicCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMedicalTopicCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
