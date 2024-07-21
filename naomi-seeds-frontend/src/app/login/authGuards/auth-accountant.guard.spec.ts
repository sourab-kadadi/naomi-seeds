import { TestBed } from '@angular/core/testing';

import { AuthAccountantGuard } from './auth-accountant.guard';

describe('AuthAccountantGuard', () => {
  let guard: AuthAccountantGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthAccountantGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
