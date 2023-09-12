import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfferCategoryComponent } from './add-offer-category.component';

describe('AddOfferCategoryComponent', () => {
  let component: AddOfferCategoryComponent;
  let fixture: ComponentFixture<AddOfferCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOfferCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
