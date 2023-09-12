import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalTopicCategoryComponent } from './medical-topic-category.component';

describe('MedicalTopicCategoryComponent', () => {
  let component: MedicalTopicCategoryComponent;
  let fixture: ComponentFixture<MedicalTopicCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalTopicCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalTopicCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
