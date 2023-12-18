import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/music',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Res() response,
    @Body() body: any,
  ) {
    try {
      const result = await this.musicService.uploadFile(
        file.filename,
        body.artistId,
      );
      if (result) {
        return response.status(201).json({
          success: true,
          message: 'Музыка загружена',
          file: file.filename,
        });
      } else {
        return response.status(409).json({
          success: false,
          message: 'Музыка уже есть в базе данных',
          file: file.filename,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException('Internal server error', error);
    }
  }

  @Post('/delete-track/:id')
  deleteTrack(@Param('id') id: string, @Res() response) {
    const result = this.musicService.remove(+id);
    if (result === null) {
      return response.status(404).json({
        success: false,
        message: 'Ошибка удаления файла',
      });
    }
    return response.status(200).json({
      success: true,
      message: 'Файл успешно удален',
    });
  }

  @Get('/get-track/:id')
  findOne(@Param('id') id: string) {
    try {
      return this.musicService.findWithArtist(+id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('/get-all-tracks')
  async findAll() {
    try {
      return this.musicService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch('/update-track/:id')
  async update(
    @Param('id') id: string,
    @Body() updateMusicDto: UpdateMusicDto,
    @Res() response,
  ) {
    try {
      await this.musicService.update(+id, updateMusicDto);
      return response.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error('Error in update:', error.message);
      return response.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
    // return this.musicService.update(+id, updateMusicDto);
  }
}
