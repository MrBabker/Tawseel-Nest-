import { Repository } from 'typeorm';
import { User } from './Users.entites';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './DTOs/CreateUser.DTO';
import { BadRequestException } from '@nestjs/common';

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userrepo: Repository<User>,
  ) {}

  public async createNewUser(createuserDTO: CreateUserDTO) {
    try {
      const userExist = await this.userrepo.findOne({
        where: { email: createuserDTO.email },
      });

      if (userExist) throw new BadRequestException('this email already used !');

      const newuser = this.userrepo.create(createuserDTO);
      return this.userrepo.save(newuser);
    } catch (error: unknown) {
      return { message: error };
    }
  }
}
