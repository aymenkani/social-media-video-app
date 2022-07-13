export interface LoginCommandType {
  email: string;
  password: string;
}

export class LoginCommand {
  constructor(public readonly cmd: LoginCommandType) {}
}
