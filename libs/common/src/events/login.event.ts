import { IncomingEvent } from './incomming-event';

export interface LoginEvent extends IncomingEvent {
  key: string;
  value: {
    email: string;
    password: string;
  };
}
