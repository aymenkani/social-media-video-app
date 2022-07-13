import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserAttrs } from 'streamapp/common';
import { LoginCommand } from './cqrs/commands/impl/login.command';
import { SignupCommand } from './cqrs/commands/impl/signup.command';

@Injectable()
export class AuthService {
  constructor(private commandBus: CommandBus) {}

  async login(email: string, password: string) {
    return await this.commandBus.execute(new LoginCommand({ email, password }));
  }

  async signup(data: UserAttrs) {
    return await this.commandBus.execute(new SignupCommand(data));
  }
}
