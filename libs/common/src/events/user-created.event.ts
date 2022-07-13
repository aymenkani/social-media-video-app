import { IncomingEvent } from './incomming-event';

export interface EventUserData {
  id: string | number;
  email: string;
  videos: Array<any>;
  isActive: boolean;
}

export interface UserCreatedEvent extends IncomingEvent {
  key: string;
  value: EventUserData;
}
