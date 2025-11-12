import { Repository } from 'typeorm';
import { NotesService } from './notes.service';
import { Note } from './note.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

describe('Notas Integration Tets', () => {
  let service: NotesService;
  let repository: Repository<Note>;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'notes_test',
          entities: [Note],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Note]),
      ],
      providers: [NotesService],
    }).compile();
    service = module.get<NotesService>(NotesService);
    repository = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  // Despues de cada prueba
  afterEach(async () => {
    await repository.query('DELETE FROM note;');
  });

  // Despues de finalizado las pruebas
  afterAll(async () => {
    const connection = repository.manager.connection;
    if (connection.isInitialized) {
      await connection.destroy();
    }
  });

  // Prueba de creacion de nueva nota
  it('Deberia crear una nota en la base de datos', async () => {
    const nuevaNota = {
      title: 'Nota de prueba',
      content: 'Contenido de prueba',
    };

    const notaCreada = await service.create(nuevaNota);

    // Verificar la respuesta del servicio
    expect(notaCreada).toHaveProperty('id');
    expect(notaCreada.title).toBe(nuevaNota.title);
    expect(notaCreada.content).toBe(nuevaNota.content);

    // Verificar que la nota se haya guardado en la base de datos
    const notasEnBD = await repository.findOneBy({ id: notaCreada.id });
    expect(notasEnBD).not.toBeNull();
    if (notasEnBD) {
      expect(notasEnBD.title).toBe(nuevaNota.title);
      expect(notasEnBD.content).toBe(nuevaNota.content);
    }
  });

  it('Deberia obtener todas las notas', async () => {
    // Crear varias notas
    const notes = [
      {
        title: 'Nota 1',
        content: 'Contenido de prueba 1',
      },
      {
        title: 'Nota 2',
        content: 'Contenido de prueba 2',
      },
      {
        title: 'Nota 3',
        content: 'Contenido de prueba 3',
      },
    ];

    // Gardar las notas en la base de datos
    await repository.save(notes);

    // Obtener las notas mediante el servicio
    const result = await service.findAll();

    // Verificar que se obtengan las notas
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    // Verificar los datos
    const titles = result.map((n) => n.title);
    expect(titles).toContain('Nota 1');
    expect(titles).toContain('Nota 2');
    expect(titles).toContain('Nota 3');

    // Verificar la integridad del contenido
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('title');
    expect(result[0]).toHaveProperty('content');
  });

  it('Deberia obtener una nota por ID', async () => {
    // Crear una nota en la base de datos
    const note = {
      title: 'Nota de prueba',
      content: 'Contenido de prueba',
    };
    const noteSave = await repository.save(note);

    // Obtener una nota mediante el servicio
    const result = await service.findOne(noteSave.id);

    // Verificar que la nota sea la misma
    expect(result).toBeDefined();
    expect(result.title).toBe(note.title);
    expect(result.content).toBe(note.content);

    // Verificar la integridad del contenido
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('content');
  });

  it('findOne - Deberia lanzar NotFoundException si la nota no existe', async () => {
    // Verificar que la nota sea la misma
    await expect(service.findOne(9999)).rejects.toThrow(
      `Nota con ID 9999 no existe`,
    );
  });
});
