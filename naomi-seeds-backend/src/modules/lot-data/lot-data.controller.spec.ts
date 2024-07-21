import { Test, TestingModule } from '@nestjs/testing';
import { LotDataController } from './lot-data.controller';

describe('LotData Controller', () => {
  let controller: LotDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotDataController],
    }).compile();

    controller = module.get<LotDataController>(LotDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
