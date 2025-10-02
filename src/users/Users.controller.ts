import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { UsersService } from './Users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Users.entites';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './DTOs/CreateUser.DTO';
import type { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User) private readonly userrepo: Repository<User>,
    private readonly usersservices: UsersService,
  ) {}

  @Post()
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

  @Get('cur')
  public GetCurrntUser(@Headers() headres: any) {
    console.log(h)
  }
}
