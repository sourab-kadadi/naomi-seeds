import { TestBed } from '@angular/core/testing';

import { PermissionCanDeleteGuard } from './permission-can-delete.guard';

describe('PermissionCanDeleteGuard', () => {
  let guard: PermissionCanDeleteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PermissionCanDeleteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
