import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalinfoListComponent } from './medicalinfo-list.component';

describe('MedicalinfoListComponent', () => {
  let component: MedicalinfoListComponent;
  let fixture: ComponentFixture<MedicalinfoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalinfoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalinfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
