import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from '../topic.service';
import { Repository } from 'typeorm';
import { TopicEntity } from '../entity/topic.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheService } from '../../cache/cache.service';
import { topicEntityMock } from '../__mocks__/topic.mock';

describe('TopicService', () => {
  let service: TopicService;
  let topicRepository: Repository<TopicEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicService,
        {
          provide: getRepositoryToken(TopicEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockReturnValue([topicEntityMock]),
          },
        },
      ],
    }).compile();

    service = module.get<TopicService>(TopicService);
    topicRepository = module.get<Repository<TopicEntity>>(
      getRepositoryToken(TopicEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(topicRepository).toBeDefined();
  });

  it('should return Topics in getAllTopicsBySubjectId', async () => {
    const topics = await service.getAllTopicsBySubjectId(
      topicEntityMock.subjectId,
    );

    expect(topics).toEqual([topicEntityMock]);
  });
});
