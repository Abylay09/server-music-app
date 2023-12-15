import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { Music } from './entities/music.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private musicRepository: Repository<Music>,
  ) {}
  async uploadFile(filename: string) {
    const track = this.musicRepository
      .createQueryBuilder('music')
      .where('music.name = :name', { name: filename })
      .getOne();
    if (track) {
      return;
    } else {
      return await this.musicRepository
        .createQueryBuilder()
        .insert()
        .into(Music)
        .values([{ name: filename }])
        .execute();
    }
  }

  findAll() {
    return `This action returns all music`;
  }

  findOne(id: number) {
    return `This action returns a #${id} music`;
  }

  update(id: number, updateMusicDto: UpdateMusicDto) {
    return `This action updates a #${id} music`;
  }

  remove(id: number) {
    return `This action removes a #${id} music`;
  }
}
