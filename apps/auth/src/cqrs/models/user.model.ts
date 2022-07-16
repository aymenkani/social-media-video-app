import { AggregateRoot } from '@nestjs/cqrs';
import { EventUserData } from 'streamapp/common';
import { OnSignupEvent } from '..';

export class UserAgg extends AggregateRoot {
  constructor(private id: string) {
    super();
  }

  onSignup(data: EventUserData) {
    this.apply(
      new OnSignupEvent({
        id: this.id,
        email: data.email,
        videos: [],
        isActive: true,
      }),
    );
  }
}
