import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Subjects, LoginEvent, SignupEvent } from 'streamapp/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(Subjects.AuthLogin)
  async login(@Payload() message: LoginEvent) {
    const { email, password } = message.value;

    return this.authService.login(email, password);
  }

  @MessagePattern(Subjects.AuthSignup)
  async signup(@Payload() message: SignupEvent) {
    const data = message.value;

    return this.authService.signup(data);
  }
}
