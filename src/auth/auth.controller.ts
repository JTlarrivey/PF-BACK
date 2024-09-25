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
import { LoginUserDto } from 'src/users/loginUserDto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/CreateUserDto';

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
      await this.authService.confirmEmail(token);
      return res.status(200).send('Correo confirmado con éxito');
    } catch (error) {
      console.error('Error confirming email:', error);
      return res.status(400).send('Error al confirmar el correo');
    }
  }

  // Endpoint para iniciar la autenticación con Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // Este método no necesita hacer nada, ya que el guard se encarga del flujo
  }

  // Callback de Google, maneja la respuesta después de la autenticación
  // Callback de Google
  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('User from Google:', req.user);
      const { accessToken } = await this.authService.googleLogin(req);

      // Redirige al frontend y pasa el token en la URL o como cookie
      return res.redirect(`http://localhost/auth?token=${accessToken}`);
    } catch (error) {
      console.error('Error during Google authentication callback:', error);
      return res.status(500).send('An error occurred during authentication');
    }
  };
}