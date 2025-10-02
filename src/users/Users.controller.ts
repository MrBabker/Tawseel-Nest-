import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './Users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Users.entites';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './DTOs/CreateUser.DTO';
import type { Response } from 'express';
import { PayloadParamDecorator } from './decorators/Payload.decorator';
import { JWT_Payload } from 'src/utils';
import { AuthUserCookieGuard } from './gaurds/AuthUser.guard';
import { LoginUserDTO } from './DTOs/LoginUser.DTO';
import { LoggerInterceptor } from 'src/interceptors/Logging.interceptor';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User) private readonly userrepo: Repository<User>,
    private readonly usersservices: UsersService,
  ) {}

  @Post('reg')
  public async CreateNewUser(
    @Body() createuserDTO: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.usersservices.createNewUser(createuserDTO);
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'User created successfully' };
  }

  @Post('log')
  public async LoginUser(
    @Body() loginUser: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.usersservices.loginUser(loginUser);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'User created successfully' };
  }

  @Get('cur')
  @UseGuards(AuthUserCookieGuard)
  @UseInterceptors(LoggerInterceptor)
  public GetCurrntUser(@PayloadParamDecorator() payload: JWT_Payload) {
    return this.usersservices.getCurrentUser(payload.id);
  }
}
