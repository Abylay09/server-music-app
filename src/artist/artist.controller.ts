import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post('/create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/artist/images',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async create(
    @Body() createArtistDto: CreateArtistDto,
    @Res() response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const result = await this.artistService.create(
        createArtistDto,
        file.filename,
      );
      if (result) {
        return response.status(200).json({
          success: true,
          message: result.raw,
        });
      }
    } catch (error) {
      response.status(404).json({
        success: false,
        message: 'Ошибка при создании артиста',
      });
    }
  }

  @Get('/all')
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(+id);
  }

  @Patch('/update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/artist/images',
        filename: (req, file, cb) => {
          cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    try {
      const response = await this.artistService.update(
        +id,
        updateArtistDto,
        file.filename,
      );
      if (response) {
        return res.status(200).json({
          success: true,
          message: 'Данные успешно обновлены',
        });
      } else {
        throw new NotFoundException('Artist not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Delete('/remove/:id')
  async remove(@Param('id') id: string, @Res() response) {
    try {
      const result = await this.artistService.remove(+id);

      if (result.affected && result.affected > 0) {
        return response.status(200).json({
          success: true,
        });
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      console.error('Error in remove:', error.message);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
