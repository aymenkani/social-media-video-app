import {
  Body,
  Controller,
  FileTypeValidator,
  Inject,
  MaxFileSizeValidator,
  OnModuleDestroy,
  OnModuleInit,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Subjects, UploadVideoBody } from 'streamapp/common';
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
}
