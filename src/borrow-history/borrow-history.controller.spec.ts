import { Test, TestingModule } from '@nestjs/testing';
import { BorrowHistoryController } from './borrow-history.controller';

describe('BorrowHistoryController', () => {
  let controller: BorrowHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowHistoryController],
    }).compile();

    controller = module.get<BorrowHistoryController>(BorrowHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
