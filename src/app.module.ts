// Paquetes propios de NestJS
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Paquetes del proyecto actual
import { NotesModule } from './notes/notes.module';
import { Note } from './notes/note.entity';

// Paquetes instalados
// npm install @nestjs/typeorm typeorm
// npm install mysql2
import { TypeOrmModule } from '@nestjs/typeorm';
// npm install @nestjs/config
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'notes_db',
      entities: [Note],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
