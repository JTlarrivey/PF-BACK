import { Request } from 'express';
import { User } from '@prisma/client'; // Asegúrate de que el modelo User se importe correctamente

export interface ExtendedRequest extends Request {
  user?: User; // Esto se ajusta al modelo de Prisma que has compartido
}
