import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/createUserDto'; // Asegúrate de que el nombre sea correcto
import { LoginUserDto } from 'src/users/loginUserDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() credentials: LoginUserDto) {
    const { email, password } = credentials;
    return this.authService.signIn(email, password);
  }

  @Post('signup')
  async signUp(@Body() userData: CreateUserDto) {
    return this.authService.signUp(userData);
  }
}
