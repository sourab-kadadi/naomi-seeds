import { TestBed } from '@angular/core/testing';

import { AuthDistributorGuard } from './auth-distributor.guard';

describe('AuthDistributorGuard', () => {
  let guard: AuthDistributorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthDistributorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
