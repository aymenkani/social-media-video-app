import { UserAttrs } from 'streamapp/common';

export class SignupCommand {
  constructor(public readonly cmd: UserAttrs) {}
}
