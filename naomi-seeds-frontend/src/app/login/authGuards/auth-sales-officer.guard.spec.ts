import { TestBed } from '@angular/core/testing';

import { AuthSalesOfficerGuard } from './auth-sales-officer.guard';

describe('AuthSalesOfficerGuard', () => {
  let guard: AuthSalesOfficerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthSalesOfficerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
