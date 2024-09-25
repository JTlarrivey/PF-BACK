import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/users/roles.enum';
import { ExtendedRequest } from 'src/interface/extended-request.interface'; // Ajusta la ruta según tu estructura

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest<ExtendedRequest>();

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('No se ha enviado un token');

    try {
      const secret = process.env.JWT_SECRET;
      const user = this.jwtService.verify(token, { secret });
      if (!user) throw new UnauthorizedException('Error al validar token');

      user.exp = new Date(user.exp * 1000);
      user.roles = user.isAdmin ? [Role.Admin] : [Role.User];

      request.user = user;

    } catch (error) {
      throw new UnauthorizedException('Error al validar token');
    }
    return true;
  }
}
