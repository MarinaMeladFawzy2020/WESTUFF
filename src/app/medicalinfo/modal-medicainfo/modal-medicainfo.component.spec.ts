import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMedicainfoComponent } from './modal-medicainfo.component';

describe('ModalMedicainfoComponent', () => {
  let component: ModalMedicainfoComponent;
  let fixture: ComponentFixture<ModalMedicainfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMedicainfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMedicainfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
