import { IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  readonly user_id: number;  // ID del usuario que recibe la notificación

  @IsNotEmpty()
  readonly content: string;  // Contenido de la notificación
}
