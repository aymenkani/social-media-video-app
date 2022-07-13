import { IncomingEvent } from './incomming-event';

export interface GetContentEvent extends IncomingEvent {
  key: string;
  value: {
    userId: number;
    page: number;
    perPage: number;
  };
}
