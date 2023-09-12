import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCorrespondenceComponent } from './modal-correspondence.component';

describe('ModalCorrespondenceComponent', () => {
  let component: ModalCorrespondenceComponent;
  let fixture: ComponentFixture<ModalCorrespondenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCorrespondenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCorrespondenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
