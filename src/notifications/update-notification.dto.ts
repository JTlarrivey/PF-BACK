import { IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  readonly content?: string; // Campo opcional para actualizar el contenido de la notificación
}
