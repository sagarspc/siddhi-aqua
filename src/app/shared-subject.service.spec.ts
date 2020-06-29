import { TestBed } from '@angular/core/testing';

import { SharedSubjectService } from './shared-subject.service';

describe('SharedSubjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedSubjectService = TestBed.get(SharedSubjectService);
    expect(service).toBeTruthy();
  });
});
