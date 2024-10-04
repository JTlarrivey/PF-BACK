import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Usar la clave secreta del entorno
    });
  }

  async validate(payload: any) {
    return {
      user_id: payload.id, // Asegúrate de que este campo coincida con el payload
      email: payload.email,
      name: payload.name,
      // Agrega otros campos según sea necesario
    };
  }
  
}