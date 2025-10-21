import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);

    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Deberia crear una nueva nota', async () => {
      const mockNote: Note = {
        id: 1,
        title: 'Nota 1',
        content: 'Contenido',
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockNote);

      const createNoteDto: CreateNoteDto = {
        title: 'Nota 1',
        content: 'Contenido',
      };
      const result = await controller.create(createNoteDto);
      expect(result).toEqual(mockNote);

      expect(service.create).toHaveBeenCalledWith(createNoteDto);
    });
  });

  describe('Deberia encontrar una nota por ID (findOne)', () => {
    it('Cuando la nota NO existe', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);

      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('Cuando la nota SI existe', async () => {
      const mockNote: Note = {
        id: 1,
        title: 'Nota 1',
        content: 'Contenido',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockNote);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockNote);

      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('Cuando el ID NO es un numero', async () => {
      await expect(controller.findOne('abc')).rejects.toThrow(
        new BadRequestException('El valor del ID debe ser numérico'),
      );

      expect(service.findOne).not.toHaveBeenCalled();
    });
  });
});
