import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { Music } from './entities/music.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private musicRepository: Repository<Music>,
  ) {}
  async uploadFile(filename: string, artistId) {
    try {
      const track = await this.musicRepository
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
          .values([{ name: filename, artistId: artistId }])
          .execute();
      }
    } catch (error) {
      throw new InternalServerErrorException('Internal server error', error);
    }
  }

  async findAll() {
    return await this.musicRepository.createQueryBuilder('music').getMany();
  }

  async searchByTitle(name: string): Promise<Music[]> {
    if (!name.trim()) {
      return [];
    }
    return this.musicRepository
      .createQueryBuilder('music')
      .where('music.name LIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async findWithArtist(id: number) {
    try {
      return await this.musicRepository
        .createQueryBuilder('music')
        .where('music.id = :id', { id })
        .leftJoinAndSelect('music.artist', 'artist')
        .getMany();
    } catch (error) {
      throw new Error('Custom error message');
    }
  }

  async findOne(id: number) {
    return await this.musicRepository
      .createQueryBuilder('music')
      .where('music.id = :id', { id })
      .getOne();
  }

  async update(id: number, updateMusicDto: UpdateMusicDto) {
    return await this.musicRepository
      .createQueryBuilder('music')
      .update(Music)
      .set({ ...updateMusicDto })
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number) {
    const track = await this.findOne(id);
    if (track) {
      fs.unlink('public/music/' + track.name, (err) => {
        if (err) {
          throw new InternalServerErrorException();
        }
      });
      return await this.musicRepository
        .createQueryBuilder('users')
        .delete()
        .from(Music)
        .where('id = :id', { id })
        .execute();
    } else {
      return null;
    }
  }
}
