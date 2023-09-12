import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingsListStatisticsComponent } from './votings-list-statistics.component';

describe('VotingsListStatisticsComponent', () => {
  let component: VotingsListStatisticsComponent;
  let fixture: ComponentFixture<VotingsListStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingsListStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingsListStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
