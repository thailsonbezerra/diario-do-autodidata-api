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
import * as handleOptionalFilterDateModule from '../../utils/handleOptionalFilterDate';

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
            getCache: jest.fn((key, functionRequest) => functionRequest()),
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
    const userId = 1;
    const statusId = 2;
    const dtInicio = '1900-01-01';
    const dtFim = '2999-12-31';

    it('should return list of subjects', async () => {
      const subjects = await service.getAllByUserId(userId);

      expect(subjects).toEqual([subjectEntityMock]);
    });

    it('should return error db exception', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error());

      expect(service.getAllByUserId(userId)).rejects.toThrowError();
    });

    it('should call handleOptionalFilterDate at least once', async () => {
      const handleOptionalFilterDateMock = jest.spyOn(
        handleOptionalFilterDateModule,
        'handleOptionalFilterDate',
      );

      await service.getAllByUserId(userId);

      expect(handleOptionalFilterDateMock).toHaveBeenCalled();
    });

    it('should return filtered subjects by status', async () => {
      const filteredSubjectEntityMock = subjectEntityMock.filter(
        (subject) => subject.statusId === statusId,
      );

      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(filteredSubjectEntityMock);

      const subjects = await service.getAllByUserId(userId, statusId);

      expect(subjects).toEqual(filteredSubjectEntityMock);
    });

    it('should return subjects within date range', async () => {
      const filteredSubjectEntityMock = subjectEntityMock.filter(
        (subject) =>
          subject.createdAt >= new Date(dtInicio) &&
          subject.createdAt <= new Date(dtFim),
      );

      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(filteredSubjectEntityMock);

      const subjects = await service.getAllByUserId(
        userId,
        undefined,
        dtInicio,
        dtFim,
      );

      expect(subjects).toEqual(filteredSubjectEntityMock);
    });
  });

  describe('getByIdUsingRelations()', () => {
    const subjectId = 1;
    let userId = 1;
    it('should return subject', async () => {
      const subject = await service.getByIdUsingRelations(subjectId, userId);

      expect(subject).toEqual(subjectRelationsMock);
    });

    it('should return error db exception', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Database Error'));

      expect(service.getByIdUsingRelations(subjectId, userId)).rejects.toThrow(
        'Database Error',
      );
    });

    it('should throw NotFoundException when subject is not found', async () => {
      jest.spyOn(repository, 'findOne').mockReturnValue(undefined);

      await expect(
        service.getByIdUsingRelations(subjectId, userId),
      ).rejects.toThrow(`Subject #${subjectId} Not Found`);
    });

    it('should throw forbidden when the subject is not for the user', async () => {
      userId = 2;
      await expect(
        service.getByIdUsingRelations(subjectId, userId),
      ).rejects.toThrow(`User without access to subject #${subjectId}`);
    });
  });
});
