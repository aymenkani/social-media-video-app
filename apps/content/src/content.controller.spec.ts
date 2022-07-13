import { Test, TestingModule } from '@nestjs/testing';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

describe('ContentController', () => {
  let contentController: ContentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [ContentService],
    }).compile();

    contentController = app.get<ContentController>(ContentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(contentController.getHello()).toBe('Hello World!');
    });
  });
});
