import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  OnModuleDestroy,
  OnModuleInit,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { buffer } from 'stream/consumers';
import { Subjects, UploadVideoBody } from 'streamapp/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { MainService } from './main.service';

@Controller()
export class MainController implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientKafka,
    @Inject('CONTENT_SERVICE') private readonly contentService: ClientKafka,

    private readonly mainService: MainService,
  ) {}

  async onModuleInit() {
    this.authService.subscribeToResponseOf(Subjects.AuthLogin);
    this.authService.subscribeToResponseOf(Subjects.AuthSignup);

    this.contentService.subscribeToResponseOf(Subjects.UploadVideo);
    this.contentService.subscribeToResponseOf(Subjects.StreamVideo);

    await this.authService.connect();
    await this.contentService.connect();
  }

  async onModuleDestroy() {
    this.authService.close();
    this.contentService.close();
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000 }),
          new FileTypeValidator({ fileType: 'mp4' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadVideoBody,
  ) {
    return this.mainService.uploadFile({
      body,
      buffer: file.buffer.toString(),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('video')
  async streamVideo(@Body() videoId: number, @Res() res: Response) {
    (await this.mainService.streamVideo(videoId)).subscribe(
      async (buffer) => await writeFile('/videos/video.mp4', buffer),
    );

    const videoStream = createReadStream('/videos/video.mp4');

    return videoStream.pipe(res);
  }
}
