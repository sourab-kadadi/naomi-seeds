import { Test, TestingModule } from '@nestjs/testing';
import { LotDataService } from './lot-data.service';

describe('LotDataService', () => {
  let service: LotDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotDataService],
    }).compile();

    service = module.get<LotDataService>(LotDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
