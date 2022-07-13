import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MainResolver } from './main.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { jwtConstants } from 'streamapp/common';
import { MulterModule } from '@nestjs/platform-express';
import { JwtStrategy } from './auth/jwt-strategy';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
    }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    MulterModule.register({
      dest: './upload',
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
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
      },
    ]),
    ClientsModule.register([
      {
        name: 'CONTENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'content',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'content-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [MainController],
  providers: [MainService, MainResolver, JwtStrategy],
})
export class MainModule {}
