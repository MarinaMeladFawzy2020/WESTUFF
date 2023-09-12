import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNewsCategoryComponent } from './list-news-category.component';

describe('ListNewsCategoryComponent', () => {
  let component: ListNewsCategoryComponent;
  let fixture: ComponentFixture<ListNewsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNewsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNewsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
