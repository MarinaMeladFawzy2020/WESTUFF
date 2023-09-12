import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInitiativesComponent } from './modal-initiatives.component';

describe('ModalInitiativesComponent', () => {
  let component: ModalInitiativesComponent;
  let fixture: ComponentFixture<ModalInitiativesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInitiativesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
