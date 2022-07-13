import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Video } from './video.model';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => [Video])
  videos: Video[];
}
