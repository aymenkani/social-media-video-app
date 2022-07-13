export interface IncomingEvent {
  topic?: string;
  partition?: number;
  timestamp?: string;
  size?: number;
  attributes?: number;
  offset?: string;
  key?: any;
  value: any;
  headers?: Record<string, any>;
}
