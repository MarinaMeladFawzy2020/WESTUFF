import { TestBed } from '@angular/core/testing';

import { MedicalTopicService } from './medical-topic.service';

describe('MedicalTopicService', () => {
  let service: MedicalTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
