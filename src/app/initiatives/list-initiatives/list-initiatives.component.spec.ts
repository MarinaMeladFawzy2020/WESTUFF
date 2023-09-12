import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInitiativesComponent } from './list-initiatives.component';

describe('ListInitiativesComponent', () => {
  let component: ListInitiativesComponent;
  let fixture: ComponentFixture<ListInitiativesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInitiativesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
