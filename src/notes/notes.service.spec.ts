import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { Note } from './note.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockNoteRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockNote = {
  id: 1,
  title: 'Test Note',
  content: 'Test Content',
};

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('NotesService', () => {
  let service: NotesService;
  let repository: MockRepository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: mockNoteRepository(),
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get<MockRepository<Note>>(getRepositoryToken(Note));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Deberia crear una nueva nota', async () => {
    jest.spyOn(repository, 'save').mockResolvedValue(mockNote as Note);

    const result = await service.create({
      title: 'Test Note',
      content: 'Test Content',
    });

    expect(result).toEqual(mockNote);

    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
  });
});
