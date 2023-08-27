import { Test, TestingModule } from '@nestjs/testing';
import { SubjectService } from '../subject.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubjectEntity } from '../entity/subject.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { subjectEntityMock } from '../__mocks__/subject.mock';
import { TopicService } from '../../topic/topic.service';
import { CacheService } from '../../cache/cache.service';
import { subjectRelationsMock } from '../__mocks__/subject-relations.mock';

describe('SubjectService', () => {
  let service: SubjectService;
  let repository: Repository<SubjectEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        {
          provide: getRepositoryToken(SubjectEntity),
          useValue: {
            save: jest.fn().mockReturnValue(subjectEntityMock),
            find: jest.fn().mockReturnValue([subjectEntityMock]),
            findOne: jest.fn().mockReturnValue(subjectRelationsMock),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn(),
          },
        },
        {
          provide: TopicService,
          useValue: {
            findUserById: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn(() => subjectRelationsMock),
          },
        },
      ],
    }).compile();

    service = module.get<SubjectService>(SubjectService);
    repository = module.get<Repository<SubjectEntity>>(
      getRepositoryToken(SubjectEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getAllByUserId()', () => {
    it('should return list of subjects', async () => {
      const subjects = await service.getAllByUserId(1);

      expect(subjects).toEqual([subjectEntityMock]);
    });

    it('should return error db exception', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error());

      expect(service.getAllByUserId(1)).rejects.toThrowError();
    });
  });

  describe('getByIdUsingRelations()', () => {
    it('should return subject', async () => {
      const subject = await service.getByIdUsingRelations(1, 1);

      expect(subject).toEqual(subjectRelationsMock);
    });

    it('should throw NotFoundException when subject is not found', async () => {
      jest.spyOn(repository, 'findOne').mockReturnValue(undefined);

      await expect(service.getById(1, 1)).rejects.toThrow(
        `SubjectId: ${1} Not Found`,
      );
    });

    it('should throw forbidden when the subject is not for the user', async () => {
      await expect(service.getById(1, 2)).rejects.toThrow(
        `Subject Not Found by SubjectId: ${1} for that user`,
      );
    });
  });
});
