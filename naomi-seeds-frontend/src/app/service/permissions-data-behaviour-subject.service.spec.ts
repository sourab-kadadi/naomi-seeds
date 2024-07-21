import { TestBed } from '@angular/core/testing';

import { PermissionsDataBehaviourSubjectService } from './permissions-data-behaviour-subject.service';

describe('PermissionsDataBehaviourSubjectService', () => {
  let service: PermissionsDataBehaviourSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsDataBehaviourSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
