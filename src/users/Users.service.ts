import { Repository } from 'typeorm';
import { User } from './Users.entites';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './DTOs/CreateUser.DTO';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JWT_Payload } from 'src/utils';

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userrepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async createNewUser(createuserDTO: CreateUserDTO) {
    try {
      const userExist = await this.userrepo.findOne({
        where: { email: createuserDTO.email },
      });

      if (userExist) throw new BadRequestException('this email already used !');

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(createuserDTO.password, salt);

      const newuser = this.userrepo.create({
        usernmae: createuserDTO.usernmae,
        email: createuserDTO.email,
        password: hashPassword,
        phonenumber: createuserDTO.phonenumber,
        location: createuserDTO.location,
      });

      await this.userrepo.save(newuser);
      const payload: JWT_Payload = {
        id: newuser.id,
        username: newuser.usernmae,
        email: newuser.email,
        phonenumber: newuser.phonenumber,
        location: newuser.location,
      };

      const access_token = await this.jwtService.signAsync(payload);

      return access_token;
    } catch (error: unknown) {
      throw new BadRequestException(error);
    }
  }
}
