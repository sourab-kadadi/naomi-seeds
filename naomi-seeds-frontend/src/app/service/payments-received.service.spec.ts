import { TestBed } from '@angular/core/testing';

import { PaymentsReceivedService } from './payments-received.service';

describe('PaymentsReceivedService', () => {
  let service: PaymentsReceivedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsReceivedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
