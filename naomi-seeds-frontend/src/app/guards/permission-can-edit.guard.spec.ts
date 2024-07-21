import { TestBed } from '@angular/core/testing';

import { PermissionCanEditGuard } from './permission-can-edit.guard';

describe('PermissionCanEditGuard', () => {
  let guard: PermissionCanEditGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PermissionCanEditGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
