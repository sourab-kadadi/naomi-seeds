import { Test, TestingModule } from '@nestjs/testing';
import { GeneralCrDrService } from './general-cr-dr.service';

describe('GeneralCrDrService', () => {
  let service: GeneralCrDrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralCrDrService],
    }).compile();

    service = module.get<GeneralCrDrService>(GeneralCrDrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
