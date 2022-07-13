import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Video } from './entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Video])],
  controllers: [ContentsController],
  providers: [ContentsService],
  exports: [TypeOrmModule],
})
export class ContentsModule {}
