import { UserAttrs } from '..';
import { IncomingEvent } from './incomming-event';

export interface SignupEvent extends IncomingEvent {
  key: string;
  value: UserAttrs;
}
