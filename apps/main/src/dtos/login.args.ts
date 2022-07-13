import { IsEmail, IsEmpty } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class LoginArgs {
  @Field({ nullable: true })
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsEmpty()
  password: string;
}
