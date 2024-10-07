import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserStatusGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // el usuario autenticado

        // Verificar si el usuario está definido
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado.');
        }

        // Verificar si el usuario está eliminado o baneado
        if (user.isDeleted === true || user.isBanned === true) {
            throw new ForbiddenException('Usuario no autorizado para realizar esta acción.');
        }

        return true; // Permitir el acceso si no está eliminado ni baneado
    }
}
