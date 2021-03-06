import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Video {
  @Field(() => Int)
  id: number;

  @Field()
  user: string;

  @Field({ nullable: true })
  buffer?: string;

  @Field({ nullable: true })
  isPublic?: boolean;
}
