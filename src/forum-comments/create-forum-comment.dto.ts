import { IsNotEmpty } from 'class-validator';

export class CreateForumCommentDto {
  @IsNotEmpty()
  readonly content: string;  // Contenido del comentario

  @IsNotEmpty()
  readonly forum_id: number;  // ID del foro al que pertenece el comentario

  @IsNotEmpty()
  readonly user_id: number;  // ID del usuario que hace el comentario
}
