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
        .setTitle('BOOKNITY')
        .setDescription('Es una API diseñada para fomentar la lectura y crear un ambiente social enriquecedor entre los usuarios. Esta plataforma permite a los amantes de los libros interactuar, compartir sus lecturas y opiniones, y descubrir nuevas obras a través de un sistema de recomendaciones y listas de lectura personalizadas.')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
    
    const port = 3000;
    await app.listen(port);
    
}

bootstrap();
