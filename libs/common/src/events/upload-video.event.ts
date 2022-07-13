import { UploadVideoDto } from '..';
import { IncomingEvent } from './incomming-event';

export interface UploadVideoEvent extends IncomingEvent {
  key: string;
  value: UploadVideoDto;
}
