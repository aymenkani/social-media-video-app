import { IncomingEvent } from './incomming-event';

export interface StreamVideoEvent extends IncomingEvent {
  key: string;
  value: {
    videoId: number;
  };
}
