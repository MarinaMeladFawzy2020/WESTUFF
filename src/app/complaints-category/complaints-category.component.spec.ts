import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsCategoryComponent } from './complaints-category.component';

describe('ComplaintsCategoryComponent', () => {
  let component: ComplaintsCategoryComponent;
  let fixture: ComponentFixture<ComplaintsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
