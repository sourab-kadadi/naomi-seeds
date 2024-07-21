import { TestBed } from '@angular/core/testing';

import { ProductsLotService } from './products-lot.service';

describe('ProductsLotService', () => {
  let service: ProductsLotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsLotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
