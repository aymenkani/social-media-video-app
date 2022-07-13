import { UseGuards } from '@nestjs/common';
import { Query, Context, Args, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LoginArgs } from './dtos/login.args';
import { MainService } from './main.service';
import { User } from './models/user.model';
import { Video } from './models/video.model';

@Resolver()
export class MainResolver {
  constructor(private readonly mainService: MainService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async currentUser(@Context() { req }): Promise<string> {
    return req.user;
  }

  @Query(() => User)
  async login(@Args() args: LoginArgs) {
    return await this.mainService.login(args.email, args.password);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Buffer)
  async streamVideo(@Args() videoId: number) {
    return await this.mainService.streamVideo(videoId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Video)
  async getContent(@Context() { req }) {
    return await this.mainService.getContent(req.user?.userId);
  }
}
