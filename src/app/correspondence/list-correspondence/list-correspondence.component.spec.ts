import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCorrespondenceComponent } from './list-correspondence.component';

describe('ListCorrespondenceComponent', () => {
  let component: ListCorrespondenceComponent;
  let fixture: ComponentFixture<ListCorrespondenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCorrespondenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCorrespondenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
