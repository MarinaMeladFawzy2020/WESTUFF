import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalinfoComponent } from './add-medicalinfo.component';

describe('AddMedicalinfoComponent', () => {
  let component: AddMedicalinfoComponent;
  let fixture: ComponentFixture<AddMedicalinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMedicalinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMedicalinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
