import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookListDto {
    @ApiProperty({
        description: 'Nuevo nombre de la lista de libros (opcional)',
        example: 'Mis libros favoritos actualizados',
        required: false,  
    })
    readonly name?: string;

    @ApiProperty({
        description: 'Nueva descripción de la lista de libros (opcional)',
        example: 'Una colección de mis libros más leídos y recomendados.',
        required: false,  
    })
    readonly description?: string;
}
