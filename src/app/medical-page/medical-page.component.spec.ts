import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPageComponent } from './medical-page.component';

describe('MedicalPageComponent', () => {
  let component: MedicalPageComponent;
  let fixture: ComponentFixture<MedicalPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
