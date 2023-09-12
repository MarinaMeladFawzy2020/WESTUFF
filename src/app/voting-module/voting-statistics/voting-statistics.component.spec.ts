import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingStatisticsComponent } from './voting-statistics.component';

describe('VotingStatisticsComponent', () => {
  let component: VotingStatisticsComponent;
  let fixture: ComponentFixture<VotingStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
