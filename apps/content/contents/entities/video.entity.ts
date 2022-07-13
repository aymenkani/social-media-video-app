import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @OneToMany(() => User, (user) => user.videos)
  user: User;

  @Column()
  buffer: string;

  @Column()
  tags: string[];

  @Column({ default: true })
  isPublic: boolean;
}
