import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from 'src/artist/entities/artist.entity';
@Entity()
export class Music {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Artist, (artist) => artist.tracks)
  artistId: Artist;
}
