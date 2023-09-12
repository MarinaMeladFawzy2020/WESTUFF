import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingModuleComponent } from './voting-module.component';

describe('VotingModuleComponent', () => {
  let component: VotingModuleComponent;
  let fixture: ComponentFixture<VotingModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
