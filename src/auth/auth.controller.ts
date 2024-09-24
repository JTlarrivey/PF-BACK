import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/createUserDto';
import { LoginUserDto } from 'src/users/loginUserDto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // Inicia la autenticación con Google
    // Este método no necesita hacer nada, ya que el guard se encarga del flujo
  }

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('User from Google:', req.user);  // Verifica si req.user contiene datos
      const { accessToken } = await this.authService.googleLogin(req);
      
      // Redirige a una URL válida de tu frontend con el token como query param
      return res.redirect(`http://localhost:3000/dashboard?token=${accessToken}`);
    } catch (error) {
      console.error('Error during Google authentication callback:', error);
      return res.status(500).send('An error occurred during authentication');
    }
  }

}
