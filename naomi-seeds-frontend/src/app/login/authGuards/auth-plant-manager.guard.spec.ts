import { TestBed } from '@angular/core/testing';

import { AuthPlantManagerGuard } from './auth-plant-manager.guard';

describe('AuthPlantManagerGuard', () => {
  let guard: AuthPlantManagerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthPlantManagerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
