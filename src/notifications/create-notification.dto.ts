import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  
  @ApiProperty({
    description: 'ID del usuario que recibe la notificación',
    example: 1,
  })
  @IsNotEmpty()
  user_id: number;  // ID del usuario que recibe la notificación

  @ApiProperty({
    description: 'Contenido de la notificación',
    example: 'Tu pedido ha sido procesado',
  })
  @IsNotEmpty()
  content: string;  // Contenido de la notificación
}
