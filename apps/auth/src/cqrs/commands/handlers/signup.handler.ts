import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'apps/auth/users/users.service';
import { SignupCommand } from '../impl/signup.command';
import * as bycrpt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OnSignupEvent } from '../../events/impl/on-signup.event';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SignupCommand) {
    const { email, password, firstName, lastName } = command.cmd;
    const existingUser = await this.userService.findOneByEmail(email);

    if (existingUser) throw new BadRequestException('User already exist!');

    const hashedPassword = await bycrpt.hash(password, 10);

    const user = await this.userService.newUser({
      email,
      hashedPassword,
      firstName,
      lastName,
    });

    await this.eventBus.publish(
      new OnSignupEvent({
        id: user.id,
        email: user.email,
        videos: [],
        isActive: true,
      }),
    );

    return user;
  }
}
