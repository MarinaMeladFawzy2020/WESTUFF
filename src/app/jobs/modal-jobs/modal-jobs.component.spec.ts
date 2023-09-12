import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalJobsComponent } from './modal-jobs.component';

describe('ModalJobsComponent', () => {
  let component: ModalJobsComponent;
  let fixture: ComponentFixture<ModalJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
