import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewsCategoryComponent } from './add-news-category.component';

describe('AddNewsCategoryComponent', () => {
  let component: AddNewsCategoryComponent;
  let fixture: ComponentFixture<AddNewsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
