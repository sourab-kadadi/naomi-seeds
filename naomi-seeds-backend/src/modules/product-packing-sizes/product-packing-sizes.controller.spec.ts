import { Test, TestingModule } from '@nestjs/testing';
import { ProductPackingSizesController } from './product-packing-sizes.controller';

describe('ProductPackingSizes Controller', () => {
  let controller: ProductPackingSizesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductPackingSizesController],
    }).compile();

    controller = module.get<ProductPackingSizesController>(ProductPackingSizesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
