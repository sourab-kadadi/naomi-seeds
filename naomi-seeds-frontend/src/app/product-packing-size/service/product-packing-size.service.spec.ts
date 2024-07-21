import { TestBed } from '@angular/core/testing';

import { ProductPackingSizeService } from './product-packing-size.service';

describe('ProductPackingSizeService', () => {
  let service: ProductPackingSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductPackingSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
