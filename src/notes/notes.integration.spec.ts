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
    // await repository.query('DELETE FROM note;');
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
});
