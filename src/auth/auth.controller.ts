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
import { CreateUserDto, LoginUserDto } from '../users/user.dto';
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
      return res.redirect(`http://${process.env.APP_URL}/auth?token=${jwtToken}`);
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
      return res.redirect(`https://${process.env.APP_URL}/auth?token=${accessToken}`);
    } catch (error) {
      console.error('Error during Google authentication callback:', error);
      return res.status(400).send('Error en la autenticación con Google');
    }
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      await this.authService.sendPasswordResetEmail(email);
      return { message: 'Correo de restablecimiento de contraseña enviado' };
    } catch (error) {
      console.error('Error during password reset request:', error);
      throw new Error('Failed to send reset password email');
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      return await this.authService.resetPassword(token, newPassword);
    } catch (error) {
      console.error('Error during password reset:', error);
      throw new Error('Failed to reset password');
    }
  }
}

