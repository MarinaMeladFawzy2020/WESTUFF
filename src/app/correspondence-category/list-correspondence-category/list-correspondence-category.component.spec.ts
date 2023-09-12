import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCorrespondenceCategoryComponent } from './list-correspondence-category.component';

describe('ListCorrespondenceCategoryComponent', () => {
  let component: ListCorrespondenceCategoryComponent;
  let fixture: ComponentFixture<ListCorrespondenceCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCorrespondenceCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCorrespondenceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
