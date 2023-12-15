import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/login')
  async auth(@Body() body: AuthDto) {
    try {
      return this.authService.login(body.email, body.password);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Post('/registration')
  async create(@Body() createUserDto: CreateUserDto, @Res() response) {
    try {
      await this.userService.create(createUserDto);
      return response
        .status(201)
        .json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Ошибка при регистрации пользователя' });
    }
  }
}
