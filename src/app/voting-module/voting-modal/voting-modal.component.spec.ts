import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingModalComponent } from './voting-modal.component';

describe('VotingModalComponent', () => {
  let component: VotingModalComponent;
  let fixture: ComponentFixture<VotingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
