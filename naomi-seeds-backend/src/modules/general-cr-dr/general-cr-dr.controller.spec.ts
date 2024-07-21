import { Test, TestingModule } from '@nestjs/testing';
import { GeneralCrDrController } from './general-cr-dr.controller';

describe('GeneralCrDr Controller', () => {
  let controller: GeneralCrDrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralCrDrController],
    }).compile();

    controller = module.get<GeneralCrDrController>(GeneralCrDrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
