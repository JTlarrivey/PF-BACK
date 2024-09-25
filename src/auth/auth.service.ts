import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { UserResponseDto } from 'src/users/userResponseDto'; 
import { OAuth2Client } from 'google-auth-library'; // Importar cliente de Google
import * as nodemailer from 'nodemailer'; // Importar nodemailer
import { CreateUserDto } from 'src/users/createuserDto';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Cliente OAuth de Google

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Configuración de Nodemailer para el envío de correos electrónicos
  private async sendConfirmationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Usar Gmail o cualquier servicio de email preferido
      auth: {
        user: process.env.EMAIL_USER, // Tu dirección de correo
        pass: process.env.EMAIL_PASS, // Contraseña de aplicación de tu correo
      },
    });

    const confirmationUrl = `${process.env.APP_URL}/auth/confirm?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirma tu correo electrónico',
      text: `Por favor, confirma tu cuenta haciendo clic en el siguiente enlace: ${confirmationUrl}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo de confirmación enviado');
    } catch (error) {
      console.error('Error al enviar el correo de confirmación:', error);
      throw new BadRequestException('Error al enviar el correo de confirmación');
    }
  }

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

    if (!user.isConfirmed) {
      throw new BadRequestException('Por favor, confirma tu correo electrónico antes de iniciar sesión.');
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
        isConfirmed: false, // El usuario no está confirmado al registrarse
      },
    });

    const confirmationToken = this.jwtService.sign({ email: user.email });

    // Enviar el correo de confirmación
    await this.sendConfirmationEmail(user.email, confirmationToken);

    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      photoUrl: user.photoUrl,
      registration_date: user.registration_date,
    };
  }

  async confirmEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const email = decoded.email;

      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new BadRequestException('Token inválido o usuario no encontrado');
      }

      if (user.isConfirmed) {
        throw new BadRequestException('Este correo ya ha sido confirmado');
      }

      await this.prisma.user.update({
        where: { email },
        data: { isConfirmed: true },
      });

      return { message: 'Correo confirmado con éxito' };
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  // Método para manejar el login con Google
  async googleLogin(req: any) {
    if (!req.user) {
        throw new BadRequestException('No user from Google');
    }

    console.log('User from Google:', req.user.user);
    
    const { email, given_name, family_name, picture, displayName } = req.user.user;
    const name = displayName || `${given_name} ${family_name}`;

    // Busca el usuario en la base de datos
    let user = await this.prisma.user.findUnique({ where: { email } });

    // Si el usuario no existe, créalo
    if (!user) {
        user = await this.prisma.user.create({
            data: {
                email,
                name,
                photoUrl: picture,
                registration_date: new Date(),
                password: '', // La contraseña puede estar vacía para usuarios de Google
                isAdmin: false,
                isConfirmed: true,
            },
        });
    }

    // Crea el payload para el token
    const payload = {
        id: user.user_id,
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl,
    };

    // Genera el token JWT
    const token = this.jwtService.sign(payload);

    // Devuelve el mensaje y el token en la respuesta
    return {
        message: 'Google login successful',
        accessToken: token, // Asegúrate de que la clave sea 'accessToken'
        user: { // Devuelve también el usuario si es necesario
            email: user.email,
            name: user.name,
            photoUrl: user.photoUrl,
        },
    };
}


}
