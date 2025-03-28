import { TestBed } from '@angular/core/testing';

import { LaceService } from './lace.service';

describe('LaceService', () => {
  let service: LaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
