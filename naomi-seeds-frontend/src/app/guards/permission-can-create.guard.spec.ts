import { TestBed } from '@angular/core/testing';

import { PermissionCanCreateGuard } from './permission-can-create.guard';

describe('PermissionCanCreateGuard', () => {
  let guard: PermissionCanCreateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PermissionCanCreateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
