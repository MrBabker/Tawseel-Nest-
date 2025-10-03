import { ILike, Repository } from 'typeorm';
import { User } from './Users.entites';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './DTOs/CreateUser.DTO';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JWT_Payload } from 'src/utils';
import { LoginUserDTO } from './DTOs/LoginUser.DTO';
import { SearchUserDTO } from './DTOs/SearchUser.DTO';

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
        employeetype: newuser.employeetype,
        isemployee: newuser.isemployee,
      };

      const access_token = await this.jwtService.signAsync(payload);

      return access_token;
    } catch (error: unknown) {
      throw new BadRequestException(error);
    }
  }

  public async loginUser(loginDTO: LoginUserDTO) {
    const user = await this.userrepo.findOne({
      where: { email: loginDTO.email },
    });
    if (user === null)
      throw new BadRequestException('invalid password or email');

    const validPassword = bcrypt.compareSync(loginDTO.password, user.password);
    if (!validPassword)
      throw new BadRequestException('invalid password or email');

    const payload: JWT_Payload = {
      id: user.id,
      username: user.usernmae,
      email: user.email,
      phonenumber: user.phonenumber,
      location: user.location,
      employeetype: user.employeetype,
      isemployee: user.isemployee,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }

  public getAllUsers(searchUserDTO: SearchUserDTO) {
    const filter = {
      ...(searchUserDTO.email
        ? { email: ILike(`%${searchUserDTO.email}%`) }
        : {}),
      ...(searchUserDTO.employeetype
        ? { employeetype: ILike(`%${searchUserDTO.employeetype}%`) }
        : {}),
      ...(searchUserDTO.id ? { id: searchUserDTO.id } : {}),
      ...(searchUserDTO.isemployee
        ? { isemployee: searchUserDTO.isemployee }
        : {}),
      ...(searchUserDTO.isvalidate
        ? { isvalidate: searchUserDTO.isvalidate }
        : {}),
      ...(searchUserDTO.location
        ? { location: ILike(`%${searchUserDTO.location}%`) }
        : {}),
      ...(searchUserDTO.phonenumber
        ? { phonenumber: ILike(`%${searchUserDTO.phonenumber}%`) }
        : {}),
      ...(searchUserDTO.usernmae
        ? { usernmae: ILike(`%${searchUserDTO.usernmae}%`) }
        : {}),
    };
    return this.userrepo.find({ where: filter });
  }

  public async getCurrentUser(id: number) {
    return this.userrepo.findOne({ where: { id: id } });
  }
}
