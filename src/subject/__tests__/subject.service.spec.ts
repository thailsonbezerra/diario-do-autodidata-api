import { Test, TestingModule } from '@nestjs/testing';
import { SubjectService } from '../subject.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubjectEntity } from '../entity/subject.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { subjectEntityMock } from '../__mocks__/subject.mock';

describe('SubjectService', () => {
  let service: SubjectService;
  let subjectRepository: Repository<SubjectEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        {
          provide: getRepositoryToken(SubjectEntity),
          useValue: {
            save: jest.fn().mockReturnValue(subjectEntityMock),
            find: jest.fn().mockReturnValue([subjectEntityMock]),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockReturnValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<SubjectService>(SubjectService);
    subjectRepository = module.get<Repository<SubjectEntity>>(
      getRepositoryToken(SubjectEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(subjectRepository).toBeDefined();
  });

  it('should return list of subjects', async () => {
    const subjects = await service.getAll();

    expect(subjects).toEqual([subjectEntityMock]);
  });

  it('should return error ub exception', async () => {
    jest.spyOn(subjectRepository, 'find').mockRejectedValue(new Error());

    expect(service.getAll()).rejects.toThrowError();
  });
});
