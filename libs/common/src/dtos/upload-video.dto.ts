import { MinLength } from 'class-validator';

export class UploadVideoBody {
  @MinLength(3)
  title: string;

  userId: number;

  tags: string[];
}

export class UploadVideoDto {
  body: UploadVideoBody;

  buffer: string;
}
