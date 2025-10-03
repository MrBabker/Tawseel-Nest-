import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // سمح لـ localhost:3000
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS', // الطرق المسموحة
    credentials: true, // مهم عشان الكوكيات
  });

  const config = new DocumentBuilder()

    .setVersion('1.0')

    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
