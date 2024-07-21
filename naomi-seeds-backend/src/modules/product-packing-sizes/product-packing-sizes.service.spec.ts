import { Test, TestingModule } from '@nestjs/testing';
import { ProductPackingSizesService } from './product-packing-sizes.service';

describe('ProductPackingSizesService', () => {
  let service: ProductPackingSizesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPackingSizesService],
    }).compile();

    service = module.get<ProductPackingSizesService>(ProductPackingSizesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
