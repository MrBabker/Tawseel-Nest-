import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './Users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Users.entites';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './DTOs/CreateUser.DTO';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User) private readonly userrepo: Repository<User>,
    private readonly usersservices: UsersService,
  ) {}

  @Post('user')
  public CreateNewUser(@Body() createuserDTO: CreateUserDTO) {
    return this.usersservices.createNewUser(createuserDTO);
  }
}
