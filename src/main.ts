import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// backend/src/main.ts
// backend/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ ضيف السطر ده هنا
  app.setGlobalPrefix('api'); 

  app.enableCors({
  origin: ['http://localhost:4200', 'https://carco-production.up.railway.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();