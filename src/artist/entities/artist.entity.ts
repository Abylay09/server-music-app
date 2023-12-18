import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Music } from 'src/music/entities/music.entity';
@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  surname: string;

  @Column({ nullable: true })
  pseudonym: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Music, (music) => music.artistId)
  tracks: Music[];
}
