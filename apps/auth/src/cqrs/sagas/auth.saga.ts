import { Inject, Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import { Subjects, UserCreatedEvent } from 'streamapp/common';
import { OnSignupEvent } from '../events/impl/on-signup.event';

@Injectable()
export class AuthSagas {
  constructor(@Inject('CONTENT_SERVICE') private contentService: ClientKafka) {}

  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OnSignupEvent),
      map(({ data }) => () => {
        this.contentService.emit<string, UserCreatedEvent>(
          Subjects.UserCreated,
          {
            key: Subjects.UserCreated,
            value: {
              id: data.id,
              email: data.email,
              videos: data.videos,
              isActive: data.isActive,
            },
          },
        );
      }),
    );
  };
}
