import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'apps/auth/users/users.service';
import { LoginCommand } from '../impl/login.command';
import * as bycrpt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand) {
    const { email, password } = command.cmd;
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new BadRequestException('Wrong credentials!');

    const isEqual = await bycrpt.compare(password, user.password);

    if (!isEqual) throw new BadRequestException('Wrong credentials!');

    return { jwt: this.jwtService.sign({ email, sub: user.id }) };
  }
}
