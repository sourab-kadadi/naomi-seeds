import { TestBed } from '@angular/core/testing';

import { LotDataService } from './lot-data.service';

describe('LotDataService', () => {
  let service: LotDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LotDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
