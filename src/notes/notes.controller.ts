import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './note.entity';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(createNoteDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Note> {
    const numeroId = Number(id);
    if (isNaN(numeroId)) {
      throw new BadRequestException('El valor del ID debe ser numérico');
    }
    return this.notesService.findOne(numeroId);
  }

  @Get()
  async findAll(): Promise<Note[]> {
    return this.notesService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const numeroId = Number(id);
    if (isNaN(numeroId)) {
      throw new BadRequestException('El valor del ID debe ser numérico');
    }
    return this.notesService.update(numeroId, updateNoteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const numeroId = Number(id);
    if (isNaN(numeroId)) {
      throw new BadRequestException('El valor del ID debe ser numérico');
    }
    return this.notesService.remove(numeroId);
  }
}
