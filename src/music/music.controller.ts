import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import * as fs from 'fs';
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
  async create(@UploadedFile() file: Express.Multer.File, @Res() response) {
    try {
      const result = await this.musicService.uploadFile(file.filename);
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
      throw new HttpException('Server error', error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicService.remove(+id);
  }

  @Post('delete')
  findAll(@Body() body, @Res() response) {
    fs.unlink('public/music/' + body.filename, (err) => {
      if (err) {
        return response.status(404).json({
          success: false,
          message: 'Ошибка удаления файла',
        });
      }
      return response.status(200).json({
        success: true,
        message: 'Файл успешно удален',
      });
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto) {
    return this.musicService.update(+id, updateMusicDto);
  }
}
