import { TestBed } from '@angular/core/testing';

import { PermissionCanReadGuard } from './permission-can-read.guard';

describe('PermissionCanReadGuard', () => {
  let guard: PermissionCanReadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PermissionCanReadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
