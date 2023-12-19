import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  async create(createArtistDto: CreateArtistDto, fileName: string) {
    const artist = { ...createArtistDto, image: fileName };
    return await this.artistRepository
      .createQueryBuilder()
      .insert()
      .into(Artist)
      .values([{ ...artist }])
      .execute();
  }

  async findAll() {
    return await this.artistRepository.createQueryBuilder('artist').getMany();
  }

  async findOne(id: number) {
    return await this.artistRepository
      .createQueryBuilder('artist')
      .where({
        id,
      })
      .leftJoinAndSelect('artist.tracks', 'track')
      .getOne();
  }

  async update(id: number, updateArtistDto: UpdateArtistDto, fileName: string) {
    try {
      const artist = await this.findOne(id);

      if (artist.image) {
        const imagePath = `public/artist/images/${artist.image}`;
        try {
          await fs.promises.access(imagePath, fs.constants.F_OK);
          await fs.promises.unlink(imagePath);
        } catch (error) {
          if (error.code === 'ENOENT') {
            console.log(`File not found: ${imagePath}`);
          } else {
            throw error;
          }
        }
      }

      await this.artistRepository
        .createQueryBuilder()
        .update(Artist)
        .set({ ...updateArtistDto, image: fileName })
        .where('id = :id', { id })
        .execute();

      return true;
    } catch (error) {
      console.error('Error in update:', error.message);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  // async update(id: number, updateArtistDto: UpdateArtistDto, fileName: string) {
  //   try {
  //     const artist = await this.findOne(id);

  //     if (artist.image) {
  //       try {
  //         await fs.promises.unlink(`public/artist/images/${artist.image}`);
  //       } catch (error) {}
  //     }

  //     await this.artistRepository
  //       .createQueryBuilder()
  //       .update(Artist)
  //       .set({ ...updateArtistDto, image: fileName })
  //       .where('id = :id', { id })
  //       .execute();

  //     return true;
  //   } catch (error) {
  //     console.error('Error in update:', error.message);
  //     throw new InternalServerErrorException('Internal server error');
  //   }
  // }

  async remove(id: number) {
    try {
      return await this.artistRepository
        .createQueryBuilder('artist')
        .delete()
        .from(Artist)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      console.error('Error in remove:', error.message);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
