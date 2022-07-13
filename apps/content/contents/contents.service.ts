import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventUserData, UploadVideoDto } from 'streamapp/common';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Video } from './entities/video.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getVideo(videoId: number): Promise<Video> {
    return this.videoRepository.findOneBy({ id: videoId });
  }

  async uploadVideo(data: UploadVideoDto): Promise<Video> {
    const user = await this.userRepository.findOneBy({ id: data.body?.userId });
    if (!user) throw new UnauthorizedException();

    const video = this.videoRepository.create({
      title: data.body.title,
      user,
      buffer: data.buffer,
      tags: data.body.tags,
    });

    await this.userRepository.update(
      { id: user.id },
      { videos: [...user.videos, video] },
    );

    return await this.videoRepository.save(video);
  }

  async createUser(data: EventUserData): Promise<User> {
    const user = this.userRepository.create({
      id: data.id,
      email: data.email,
      videos: data.videos,
      isActive: data.isActive,
    });

    return await this.userRepository.save(user);
  }

  async getContent(
    userId: number,
    page: number,
    perPage: number,
  ): Promise<Video[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new UnauthorizedException();

    if (!page && !perPage) return user.feedContent.slice(0, 20);

    const start = page * perPage;
    const end = start + perPage;

    return user.feedContent.slice(start, end);
  }

  async getUser(userId: number | string): Promise<User> {
    return await this.userRepository.findOneBy({ id: userId });
  }
  async getFollowingsLatestVideos(
    usersIds: Array<number | string>,
  ): Promise<Video[]> {
    const users = [] as User[];
    usersIds.forEach(async (id) => {
      const user = await this.userRepository.findOneBy({ id });
      users.push(user);
    });

    const latestContent = users.map((user) =>
      user.videos.at(user.videos.length - 1),
    );

    return latestContent;
  }

  async updateContentFeed(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new UnauthorizedException();

    const following = user.following.sort(
      (userA, userB) => userA.watchTime - userB.watchTime,
    );

    const followingsLatestVideos =
      following.length > 0 &&
      (await this.getFollowingsLatestVideos(following.map((item) => item.id)));

    const titles = [
      ...user.dislikedVideos,
      ...user.likedVideos,
      ...user.viewHistory,
      ...user.searchHistory.map((item) => ({
        title: item.query,
      })),
    ];

    const recommended = [] as Video[];
    titles.forEach(async ({ title }) => {
      const results = await this.videoRepository.findBy({
        title: Like(`%${title}%`),
      });
      recommended.push(...results);
    });

    await this.userRepository.update(
      { id: userId },
      {
        feedContent: [...new Set([...recommended, ...followingsLatestVideos])],
      },
    );
  }
}
