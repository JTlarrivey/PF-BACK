import { IsNotEmpty } from 'class-validator';

export class CreateForumDto {
  @IsNotEmpty()
  readonly topic: string;  // Título del foro

  @IsNotEmpty()
  readonly description: string;  // Descripción del foro
}
