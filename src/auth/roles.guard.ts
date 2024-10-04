import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Asegúrate de que user y isAdmin existan
    if (!user || user.isAdmin === undefined) {
      throw new ForbiddenException('No tiene permisos suficientes');
    }

    // Verifica si el usuario es admin
    if (!user.isAdmin) {
      throw new ForbiddenException('No tiene permiso para acceder a esta ruta');
    }

    return true; // Permitir el acceso si el usuario es admin
  }
}
