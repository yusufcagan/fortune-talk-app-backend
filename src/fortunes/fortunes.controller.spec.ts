import { Test, TestingModule } from '@nestjs/testing';
import { FortunesController } from './fortunes.controller';

describe('FortunesController', () => {
  let controller: FortunesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FortunesController],
    }).compile();

    controller = module.get<FortunesController>(FortunesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
