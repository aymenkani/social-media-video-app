import { EventUserData } from 'streamapp/common';

export class OnSignupEvent {
  constructor(public readonly data: EventUserData) {}
}
