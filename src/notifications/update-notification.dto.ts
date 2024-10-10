import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  
  @ApiProperty({
    description: 'Contenido actualizado de la notificación',
    example: 'El estado de tu pedido ha cambiado',
    required: false,  
  })
  @IsOptional()
  content?: string; 
}
