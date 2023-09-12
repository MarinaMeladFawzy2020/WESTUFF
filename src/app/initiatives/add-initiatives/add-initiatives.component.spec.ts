import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInitiativesComponent } from './add-initiatives.component';

describe('AddInitiativesComponent', () => {
  let component: AddInitiativesComponent;
  let fixture: ComponentFixture<AddInitiativesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInitiativesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
