import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorrespondenceCategoryComponent } from './add-correspondence-category.component';

describe('AddCorrespondenceCategoryComponent', () => {
  let component: AddCorrespondenceCategoryComponent;
  let fixture: ComponentFixture<AddCorrespondenceCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCorrespondenceCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCorrespondenceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
