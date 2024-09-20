import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/createUserDto'; // Asegúrate de que el DTO esté importado correctamente
import { UserResponseDto } from 'src/users/userResponseDto'; // Asegúrate de tener este DTO

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException("Email y contraseña requeridos");
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("Credenciales incorrectas");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new BadRequestException("Credenciales incorrectas");
    }

    const payload = { id: user.user_id, email: user.email, isAdmin: user.isAdmin };
    const token = this.jwtService.sign(payload);

    return {
      message: "Usuario logueado...",
      token,
    };
  }

  async signUp(userData: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, name, isAdmin = false, photoUrl } = userData; // Asignar valor por defecto a isAdmin

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
        registration_date: new Date(), // Asigna la fecha de registro actual
        photoUrl, // Incluye el campo photoUrl
      },
    });

    // Devuelve un DTO sin la contraseña
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      photoUrl: user.photoUrl,
      registration_date: user.registration_date,
    };
  }
}
