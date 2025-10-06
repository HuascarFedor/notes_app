// npm install class-validator class-transformer
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty({ message: 'El titulo es obligatorio' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'El contenido es obligatorio' })
  content: string;
}
