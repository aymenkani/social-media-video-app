import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  GetContentEvent,
  LoginEvent,
  StreamVideoEvent,
  Subjects,
  UploadVideoDto,
  UploadVideoEvent,
} from 'streamapp/common';

@Injectable()
export class MainService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientKafka,
    @Inject('CONTENT_SERVICE') private readonly contentService: ClientKafka,
  ) {}

  async login(email: string, password: string) {
    return this.authService.send<string, LoginEvent>(Subjects.AuthLogin, {
      key: 'auth',
      value: {
        password,
        email,
      },
    });
  }

  async streamVideo(videoId: number) {
    return this.authService.send<string, StreamVideoEvent>(
      Subjects.StreamVideo,
      {
        key: Subjects.StreamVideo,
        value: {
          videoId,
        },
      },
    );
  }

  async uploadFile(data: UploadVideoDto) {
    return this.contentService.send<string, UploadVideoEvent>(
      Subjects.UploadVideo,
      {
        key: Subjects.UploadVideo,
        value: data,
      },
    );
  }

  async getContent(userId: number) {
    return this.contentService.send<string, GetContentEvent>(
      Subjects.GetContent,
      {
        key: Subjects.GetContent,
        value: {
          userId,
        },
      },
    );
  }
}
