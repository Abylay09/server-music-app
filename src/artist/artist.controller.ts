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
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post('/create')
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() createArtistDto: CreateArtistDto, @Res() response) {
    console.log(createArtistDto);
    return response.json({
      message: 'not found',
    });
    // try {
    //   const result = await this.artistService.create(createArtistDto);
    //   if (result) {
    //     return response.status(200).json({
    //       success: true,
    //       message: result.raw,
    //     });
    //   }
    // } catch (error) {
    //   response.status(404).json({
    //     success: false,
    //     message: 'Ошибка при создании артиста',
    //   });
    // }
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistService.update(+id, updateArtistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artistService.remove(+id);
  }
}
