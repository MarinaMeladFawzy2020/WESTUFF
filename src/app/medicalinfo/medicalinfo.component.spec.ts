import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalinfoComponent } from './medicalinfo.component';

describe('MedicalinfoComponent', () => {
  let component: MedicalinfoComponent;
  let fixture: ComponentFixture<MedicalinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
