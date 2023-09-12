import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCategoryComponent } from './offer-category.component';

describe('OfferCategoryComponent', () => {
  let component: OfferCategoryComponent;
  let fixture: ComponentFixture<OfferCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
