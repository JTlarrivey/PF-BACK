import { IsOptional } from 'class-validator';

export class UpdateForumDto {
  @IsOptional()
  readonly topic?: string; // Campo opcional para actualizar el tema

  @IsOptional()
  readonly description?: string; // Campo opcional para actualizar la descripción
}
