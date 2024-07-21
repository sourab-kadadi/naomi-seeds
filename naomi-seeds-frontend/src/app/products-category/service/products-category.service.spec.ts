import { TestBed } from '@angular/core/testing';

import { ProductsCategoryService } from './products-category.service';

describe('ProductsCategoryService', () => {
  let service: ProductsCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
