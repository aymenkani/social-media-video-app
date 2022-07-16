import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
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

  async streamVideo(videoId: number): Promise<string> {
    const video = await this.contentsService.getVideo(videoId);

    return video.buffer;
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
