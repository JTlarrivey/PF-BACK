import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from 'src/users/user.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() credentials: LoginUserDto) {
    const { email, password } = credentials;
    try {
      return await this.authService.signIn(email, password);
    } catch (error) {
      console.error('Error during sign in:', error);
      throw new Error('Failed to sign in');
    }
  }

  @Post('signup')
  async signUp(@Body() userData: CreateUserDto) {
    try {
      return await this.authService.signUp(userData);
    } catch (error) {
      console.error('Error during sign up:', error);
      throw new Error('Failed to sign up');
    }
  }

  // Nuevo endpoint para confirmar el correo electrónico
  @Get('confirm')
  async confirmEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      const { token: jwtToken } = await this.authService.confirmEmail(token);

      // Redirigir al frontend con el token para iniciar sesión automáticamente
      return res.redirect(`http://localhost/auth?token=${jwtToken}`);
    } catch (error) {
      console.error('Error confirming email:', error);
      return res.status(400).send('Error al confirmar el correo');
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // Este método no necesita hacer nada, ya que el guard se encarga del flujo
  }

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('User from Google:', req.user);
      const { accessToken } = await this.authService.googleLogin(req);

      // Redirige al frontend con el token en la URL
      return res.redirect(`http://localhost/auth?token=${accessToken}`);
    } catch (error) {
      console.error('Error during Google authentication callback:', error);
      return res.status(400).send('Error en la autenticación con Google');
    }
  }
}
