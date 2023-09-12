import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondenceCategoryComponent } from './correspondence-category.component';

describe('CorrespondenceCategoryComponent', () => {
  let component: CorrespondenceCategoryComponent;
  let fixture: ComponentFixture<CorrespondenceCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrespondenceCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondenceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
