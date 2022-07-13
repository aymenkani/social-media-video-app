import { Entity, Column, ManyToOne } from 'typeorm';
import { Video } from './video.entity';

@Entity()
export class User {
  @Column()
  id: number | string;

  @Column()
  email: string;

  @Column({ nullable: true })
  @ManyToOne(() => Video, (video) => video.user)
  videos?: [Video];

  @Column({ default: [] })
  feedContent: [Video];

  @Column({ default: [] })
  following: Array<{ id: number; watchTime: number }>;

  @Column()
  likedVideos: Array<{ id: number; title: string }>;

  @Column()
  dislikedVideos: Array<{ id: number; title: string }>;

  @Column()
  searchHistory: Array<{ query: string }>;

  @Column()
  viewHistory: Array<{ id: number; title: string }>;

  @Column({ default: true })
  isActive: boolean;
}
