import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Note } from './../src/notes/note.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';

describe('Modulo Notes (e2e)', () => {
  let app: INestApplication;
  let noteRepository: Repository<Note>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    noteRepository = moduleFixture.get<Repository<Note>>(
      getRepositoryToken(Note),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    const dataSource = app.get(DataSource);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  afterEach(async () => {
    // await noteRepository.clear();
  });

  describe('/notas (POST)', () => {
    it('Deberia crear una nueva nota', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'Nota de prueba 1',
        content: 'Este es el contenido de prueba 1',
      };

      const response = await request(app.getHttpServer())
        .post('/notes')
        .send(createNoteDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toEqual(createNoteDto.title);
      expect(response.body.content).toEqual(createNoteDto.content);
    });
  });
});
