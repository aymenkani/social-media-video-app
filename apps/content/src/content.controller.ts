import { Controller } from '@nestjs/common';
import { ContentService } from './content.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  GetContentEvent,
  StreamVideoEvent,
  Subjects,
  UploadVideoEvent,
  UserCreatedEvent,
} from 'streamapp/common';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @MessagePattern(Subjects.StreamVideo)
  async streamVideo(@Payload() message: StreamVideoEvent) {
    const videoId = message.value.videoId;
    return await this.contentService.streamVideo(videoId);
  }

  @MessagePattern(Subjects.UploadVideo)
  async uploadVideo(@Payload() message: UploadVideoEvent) {
    const data = message.value;

    return await this.contentService.uploadVideo(data);
  }

  @MessagePattern(Subjects.UserCreated)
  async onUserCreated(@Payload() message: UserCreatedEvent) {
    const data = message.value;

    return await this.contentService.createUser(data);
  }

  @MessagePattern(Subjects.GetContent)
  async getContent(@Payload() message: GetContentEvent) {
    const data = message.value;

    return await this.contentService.getContent(
      data.userId,
      data.page,
      data.perPage,
    );
  }
}
