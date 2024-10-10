import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Configuración de CORS
    app.enableCors({
        origin: '*', // Permitir todas las solicitudes (puedes modificarlo para dominios específicos)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Si necesitas permitir cookies o autenticación
    });

    const options = new DocumentBuilder()
        .setTitle('Books API')
        .setDescription('The books API description')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options, {
        deepScanRoutes: true, // Asegura que Swagger escanee rutas profundamente para DTOs anidados
    });

    SwaggerModule.setup('api', app, document);
    
    const port = 3000;
    await app.listen(port);
}

bootstrap();
