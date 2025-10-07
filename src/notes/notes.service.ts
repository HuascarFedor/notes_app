import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const newNote = this.notesRepository.create(createNoteDto);
    return this.notesRepository.save(newNote);
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException(`Nota con ID ${id} no existe`);
    }
    return note;
  }

  async findAll(): Promise<Note[]> {
    return this.notesRepository.find();
  }

  async update(id: number, updateNotaDto: UpdateNoteDto): Promise<Note> {
    const updateResult = await this.notesRepository.update(id, updateNotaDto);
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Nota con ID ${id} no existe`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.notesRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Nota con ID ${id} no existe`);
    }
  }
}
