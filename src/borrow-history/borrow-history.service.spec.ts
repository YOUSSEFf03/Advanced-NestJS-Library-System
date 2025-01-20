import { Test, TestingModule } from '@nestjs/testing';
import { BorrowHistoryService } from './borrow-history.service';

describe('BorrowHistoryService', () => {
  let service: BorrowHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowHistoryService],
    }).compile();

    service = module.get<BorrowHistoryService>(BorrowHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
