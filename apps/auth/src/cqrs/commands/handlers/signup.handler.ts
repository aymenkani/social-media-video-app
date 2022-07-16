import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'apps/auth/users/users.service';
import { SignupCommand } from '../impl/signup.command';
import * as bycrpt from 'bcrypt';
import { UserAgg } from '../../models/user.model';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
  constructor(
    private usersService: UsersService,
    //    @Inject() private readonly eventBus: EventBus,
    private publisher: EventPublisher,
  ) {}

  async execute(command: SignupCommand) {
    const { email, password, firstName, lastName } = command.cmd;
    const existingUser = await this.usersService.findOneByEmail(email);

    if (existingUser) throw new BadRequestException('User already exist!');

    const hashedPassword = await bycrpt.hash(password, 10);

    const user = await this.usersService.newUser({
      email,
      hashedPassword,
      firstName,
      lastName,
    });

    const UserModel = this.publisher.mergeClassContext(UserAgg);
    const userModel = new UserModel(user.id.toString());
    userModel.onSignup({
      id: user.id,
      email: user.email,
      videos: [],
      isActive: true,
    });
    /* await this.eventBus.publish(
      new OnSignupEvent({
        id: user.id,
        email: user.email,
        videos: [],
        isActive: true,
      }),
    ); */

    return user;
  }
}
