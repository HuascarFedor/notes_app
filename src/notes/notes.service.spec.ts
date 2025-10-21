import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { Note } from './note.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm/browser';

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

  describe('Deberia encontrar una nota por ID', () => {
    describe('Cuando la nota NO existe', () => {
      it('Deberia lanzar NotFoundException', async () => {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

        const id = 999;
        await expect(service.findOne(id)).rejects.toThrow(NotFoundException);

        expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      });
    });
    describe('Cuando la nota SI existe', () => {
      it('Deberia retornar una nota', async () => {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockNote as Note);

        const id = 1;
        const result = await service.findOne(id);
        expect(result).toEqual(mockNote);

        expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      });
    });
  });

  it('Deberia retornar todas las notas', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([mockNote] as Note[]);

    const result = await service.findAll();
    expect(result).toEqual([mockNote]);

    expect(repository.find).toHaveBeenCalled();
  });

  describe('Deberia modificar una nota por ID', () => {
    describe('Cuando la nota NO existe', () => {
      it('Deberia lanzar NotFoundException', async () => {
        const updateResult = {
          affected: 0,
        } as UpdateResult;
        jest.spyOn(repository, 'update').mockResolvedValue(updateResult);

        const id = 1;
        const updateNoteDto = {
          title: 'Nota modificada',
        };
        await expect(service.update(id, updateNoteDto)).rejects.toThrow(
          NotFoundException,
        );

        expect(repository.update).toHaveBeenCalledWith(id, updateNoteDto);
      });
    });

    describe('Cuando la nota SI existe', () => {
      it('Deberia modificar la nota', async () => {
        const updateResult = {
          affected: 1,
        } as UpdateResult;
        jest.spyOn(repository, 'update').mockResolvedValue(updateResult);

        const id = 1;
        const updateNoteDto = {
          title: 'Nota modifcada',
        };
        const noteUpdated = {
          ...mockNote,
          ...updateNoteDto,
        } as Note;
        jest.spyOn(service, 'findOne').mockResolvedValue(noteUpdated);

        const result = await service.update(id, updateNoteDto);
        expect(result).toEqual(noteUpdated);

        expect(repository.update).toHaveBeenCalledWith(id, updateNoteDto);
      });
    });
  });

  describe('Deberia eliminar una nota por ID', () => {
    describe('Cuando la nota NO existe', () => {
      it('Deberia lanzar NotFoundException', async () => {
        const deleteResult = {
          affected: 0,
        } as DeleteResult;
        jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

        const id = 999;
        await expect(service.remove(id)).rejects.toThrow(NotFoundException);

        expect(repository.delete).toHaveBeenCalledWith(id);
      });
    });

    describe('Cuando la nota SI existe', () => {
      it('Deberia eliminar la nota', async () => {
        const deleteResult = {
          affected: 1,
        } as DeleteResult;
        jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

        const id = 1;
        await service.remove(id);

        expect(repository.delete).toHaveBeenCalledWith(id);
      });
    });
  });
});
