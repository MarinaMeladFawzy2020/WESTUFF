import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOfferComponent } from './modal-offer.component';

describe('ModalOfferComponent', () => {
  let component: ModalOfferComponent;
  let fixture: ComponentFixture<ModalOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
