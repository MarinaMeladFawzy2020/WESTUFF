import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfferCategoryComponent } from './list-offer-category.component';

describe('ListOfferCategoryComponent', () => {
  let component: ListOfferCategoryComponent;
  let fixture: ComponentFixture<ListOfferCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfferCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfferCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
