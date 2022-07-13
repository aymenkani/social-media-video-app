import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Video {
  @Field(() => Int)
  id: number;

  @Field()
  user: string;

  @Field({ nullable: true })
  buffer?: Buffer;

  @Field({ nullable: true })
  isPublic?: boolean;
}
