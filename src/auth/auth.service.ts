import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/createUserDto'; 
import { UserResponseDto } from 'src/users/userResponseDto'; 
import { OAuth2Client } from 'google-auth-library'; // Importar cliente de Google

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Cliente OAuth de Google

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email y contraseña requeridos');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    const payload = {
      id: user.user_id,
      email: user.email,
      isAdmin: user.isAdmin,
      name: user.name,
      photoUrl: user.photoUrl,
    };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Usuario logueado...',
      token,
    };
  }

  async signUp(userData: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, name, isAdmin = false, photoUrl } = userData;

    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (foundUser) {
      throw new BadRequestException('El email ya se encuentra registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isAdmin,
        registration_date: new Date(),
        photoUrl,
      },
    });

    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      photoUrl: user.photoUrl,
      registration_date: user.registration_date,
    };
  }

  // Método para manejar el login con Google
  async googleLogin(req: any) {
    if (!req.user) {
      throw new BadRequestException('No user from Google');
    }

    const { email, name, picture } = req.user;
    
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Si el usuario no existe, lo creamos en la base de datos
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          photoUrl: picture,
          registration_date: new Date(),
          password: '', // No se guarda una contraseña, ya que es un usuario de Google
          isAdmin: false,},
      });
    }

    const payload = {
      id: user.user_id,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Google login successful',
      accessToken: token,
    };
  }
}
