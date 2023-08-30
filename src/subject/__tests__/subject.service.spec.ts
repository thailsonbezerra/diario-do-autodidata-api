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
import { userEntityMock } from '../../user/__mocks__/user.mock';

describe('SubjectService', () => {
  let service: SubjectService;
  let repository: Repository<SubjectEntity>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        {
          provide: getRepositoryToken(SubjectEntity),
          useValue: {
            save: jest.fn().mockReturnValue(subjectEntityMock[0]),
            find: jest.fn().mockReturnValue(subjectEntityMock),
            findOne: jest.fn().mockReturnValue(subjectEntityMock[0]),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockReturnValue(userEntityMock),
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
    userService = module.get<UserService>(UserService);
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

      expect(subjects).toEqual(subjectEntityMock);
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
    const userId = 1;
    it('should return subject', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(subjectRelationsMock);
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
      const nonExistentSubjectId = 100;

      jest.spyOn(repository, 'findOne').mockReturnValue(undefined);

      await expect(
        service.getByIdUsingRelations(nonExistentSubjectId, userId),
      ).rejects.toThrow(`Subject #${nonExistentSubjectId} Not Found`);
    });

    it('should throw forbidden when the subject is not for the user', async () => {
      const unauthorizedUserId = 2;
      await expect(
        service.getByIdUsingRelations(subjectId, unauthorizedUserId),
      ).rejects.toThrow(`User without access to subject #${subjectId}`);
    });
  });

  describe('getById()', () => {
    const subjectId = 1;
    const userId = 1;
    it('should return subject', async () => {
      const subject = await service.getById(subjectId, userId);

      expect(subject).toEqual(subjectEntityMock[0]);
    });

    it('should return error db exception', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Database Error'));

      expect(service.getById(subjectId, userId)).rejects.toThrow(
        'Database Error',
      );
    });

    it('should throw NotFoundException when subject is not found', async () => {
      const nonExistentSubjectId = 100;
      jest.spyOn(repository, 'findOne').mockReturnValue(undefined);

      await expect(
        service.getById(nonExistentSubjectId, userId),
      ).rejects.toThrow(`Subject #${nonExistentSubjectId} Not Found`);
    });

    it('should throw forbidden when the subject is not for the user', async () => {
      const unauthorizedUserId = 2;
      await expect(
        service.getById(subjectId, unauthorizedUserId),
      ).rejects.toThrow(`User without access to subject #${subjectId}`);
    });
  });

  describe('createByUserId()', () => {
    const userId = 1;
    const statusId = 1;
    const createSubjectData = {
      name: 'name teste subject',
      description: 'description teste subject',
    };

    it('should create and return a subject', async () => {
      const createdSubject = await service.createByUserId(
        createSubjectData,
        statusId,
        userId,
      );

      expect(createdSubject).toEqual(subjectEntityMock[0]);
    });

    it('should return error db exception', async () => {
      const error = new Error('Database error');
      jest.spyOn(repository, 'save').mockRejectedValue(error);

      await expect(
        service.createByUserId(createSubjectData, statusId, userId),
      ).rejects.toThrow(error);
    });

    it('should call userService.findUserById with correct userId', async () => {
      await service.createByUserId(createSubjectData, statusId, userId);

      expect(userService.findUserById).toHaveBeenCalledWith(userId);
      expect(userService.findUserById).toHaveBeenCalledTimes(1);
    });

    it('should call subjectRepository.save with correct data', async () => {
      await service.createByUserId(createSubjectData, statusId, userId);

      expect(repository.save).toHaveBeenCalledWith({
        ...createSubjectData,
        statusId,
        userId,
      });
    });

    it('should throw an error when userService.findUserById throws an error', async () => {
      jest.spyOn(userService, 'findUserById').mockRejectedValue(new Error());

      await expect(
        service.createByUserId(createSubjectData, statusId, userId),
      ).rejects.toThrow();
    });
  });
});
