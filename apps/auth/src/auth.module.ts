import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'streamapp/common';
import { DataSource } from 'typeorm';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSagas, LoginHandler, SignupHandler } from './cqrs';

const commandHandlers = [LoginHandler, SignupHandler];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
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
    ...commandHandlers,
    AuthSagas,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  constructor(private dataSource: DataSource) {}
}
