import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ContentModule } from './content.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ContentModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'auth-consumer',
      },
    },
  });

  app.listen();
}
bootstrap();
