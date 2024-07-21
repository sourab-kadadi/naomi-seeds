import { Test, TestingModule } from '@nestjs/testing';
import { LedgerController } from './ledger.controller';

describe('Ledger Controller', () => {
  let controller: LedgerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LedgerController],
    }).compile();

    controller = module.get<LedgerController>(LedgerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
