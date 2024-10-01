import { IsOptional } from 'class-validator';

export class UpdateForumCommentDto {
  @IsOptional()
  readonly content?: string; // Campo opcional para actualizar el contenido
}
