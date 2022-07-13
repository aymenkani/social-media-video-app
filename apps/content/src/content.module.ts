import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsModule } from '../contents/contents.module';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'content',
      synchronize: true,
      autoLoadEntities: true,
    }),
    ContentsModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
