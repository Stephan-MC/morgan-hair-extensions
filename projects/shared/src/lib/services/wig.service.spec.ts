import { TestBed } from '@angular/core/testing';

import { WigService } from './wig.service';

describe('WigService', () => {
  let service: WigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
