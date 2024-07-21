import { TestBed } from '@angular/core/testing';

import { GeneralDropdownsService } from './general-dropdowns.service';

describe('GeneralDropdownsService', () => {
  let service: GeneralDropdownsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralDropdownsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
