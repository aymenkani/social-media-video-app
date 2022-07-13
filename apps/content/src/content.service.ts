import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { EventUserData, UploadVideoDto } from 'streamapp/common';
import { ContentsService } from '../contents/contents.service';
import { UpdateFeedContentCommand } from './cqrs/commands/impl/update-feed-content.command';

@Injectable()
export class ContentService {
  constructor(
    private readonly contentsService: ContentsService,
    private commandBus: CommandBus,
  ) {}

  async streamVideo(videoId: number) {
    const video = await this.contentsService.getVideo(videoId);
    await writeFile('/videos/video.mp4', video.buffer);
    const videoStream = createReadStream('/videos/video.mp4');

    return videoStream;
  }

  async uploadVideo(data: UploadVideoDto) {
    return await this.contentsService.uploadVideo(data);
  }

  async createUser(data: EventUserData) {
    return await this.contentsService.createUser(data);
  }

  async getContent(userId: number, page: number, perPage: number) {
    const content = await this.contentsService.getContent(
      userId,
      page,
      perPage,
    );

    this.commandBus.execute(new UpdateFeedContentCommand(userId));

    return content;
  }
}
