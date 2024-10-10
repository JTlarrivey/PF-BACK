import { ApiProperty } from '@nestjs/swagger';

export class CreateBookListDto {
    @ApiProperty({
        description: 'Nombre de la lista de libros',
        example: 'Mis libros favoritos',
    })
    list_name: string;

    @ApiProperty({
        description: 'Descripción de la lista de libros',
        example: 'Una colección de mis libros más leídos.',
        required: false,  
    })
    description?: string;

    @ApiProperty({
        description: 'ID del usuario propietario de la lista',
        example: 123,
    })
    user_id: number;

    @ApiProperty({
        description: 'Fecha de creación de la lista',
        example: '2023-10-08T14:48:00.000Z',
        default: new Date(), 
    })
    creation_date: Date = new Date();
}
