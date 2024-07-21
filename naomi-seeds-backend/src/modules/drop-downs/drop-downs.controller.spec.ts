import { Test, TestingModule } from '@nestjs/testing';
import { DropDownsController } from './drop-downs.controller';

describe('DropDowns Controller', () => {
  let controller: DropDownsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DropDownsController],
    }).compile();

    controller = module.get<DropDownsController>(DropDownsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
