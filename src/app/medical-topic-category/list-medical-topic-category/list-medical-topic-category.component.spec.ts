import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMedicalTopicCategoryComponent } from './list-medical-topic-category.component';

describe('ListMedicalTopicCategoryComponent', () => {
  let component: ListMedicalTopicCategoryComponent;
  let fixture: ComponentFixture<ListMedicalTopicCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMedicalTopicCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMedicalTopicCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
