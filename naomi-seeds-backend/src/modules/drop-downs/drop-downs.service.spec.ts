import { Test, TestingModule } from '@nestjs/testing';
import { DropDownsService } from './drop-downs.service';

describe('DropDownsService', () => {
  let service: DropDownsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DropDownsService],
    }).compile();

    service = module.get<DropDownsService>(DropDownsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
