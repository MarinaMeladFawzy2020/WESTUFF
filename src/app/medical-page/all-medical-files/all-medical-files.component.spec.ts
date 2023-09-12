import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMedicalFilesComponent } from './all-medical-files.component';

describe('AllMedicalFilesComponent', () => {
  let component: AllMedicalFilesComponent;
  let fixture: ComponentFixture<AllMedicalFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMedicalFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMedicalFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
