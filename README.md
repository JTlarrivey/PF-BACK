# BOOKNITY API

Este es el repositorio para la aplicación backend "Booknity", un proyecto final de alumnos de Henry.

## Iniciar Aplicación.

- Una vez clonado el repositorio de github, posiciónate en el archivo package.json, o bien en la carpeta PF-BACK y con click derecho busca la opción _open in integrated terminal_. Esto abrirá el CLI en VSCode,

- En esta consola, ejecuta el comando "npm install" para instalar todas las dependencias que el proyecto necesita.

- Deberás configurar tus variables de entorno, tales como usuario, contraseña y URL de tu base de datos, algunas secret key de otras dependencias, y el puerto donde levantarás la aplicación. A continuación te dejamos un ejemplo de las variables de entorno que hemos manejado desarrollando la app:

APP_URL=
DB_NAME=
DATABASE_URL=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL_USER=  
EMAIL_PASS=  
RENDER_API_KEY=
MERCADO_PAGO_ACCESS_TOKEN=

- Luego de estas configuraciones, puedes darle a la consola el comando "npx prisma migrate dev" para generar la migración y el cliente de Prisma, el ORM que hemos implementado para comunicarnos con la base de datos en este proyecto. Si en algún momento decides modificar el archivo "Schema.Prisma", deberás eliminar la carpeta de migraciones y volver a ejecutar el commando para refrescar la información en tu base de datos. Ten en cuenta que esto reseteará tu base de datos así que ¡precaución!.

- Por último, el comando "npm run start:dev" iniciará la aplicación compilada por node.js previamente verificando que no haya ningún error.

- Listo! ya puedes levantar La API en el puerto que hayas configurado de manera local.
