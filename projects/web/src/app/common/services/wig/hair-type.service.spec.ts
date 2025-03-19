import { TestBed } from '@angular/core/testing';

import { HairTypeService } from './hair-type.service';

describe('HairTypeService', () => {
  let service: HairTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HairTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
