import { ILike, Repository } from 'typeorm';
import { User } from './Users.entites';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './DTOs/CreateUser.DTO';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JWT_Payload } from 'src/utils';
import { LoginUserDTO } from './DTOs/LoginUser.DTO';
import { SearchUserDTO } from './DTOs/SearchUser.DTO';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';
import { ResetPassDTO } from './DTOs/ResetPasswordDTO';
import { ResetPassInfoDTO } from './DTOs/ResetPassInfoDTO';

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userrepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
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

    console.log(user.isvalidate);
    if (user.isvalidate === false) {
      if (
        user.isvalidate === false ||
        !user.virfytoken ||
        user.virfytoken === null
      ) {
        const verifytoken = randomBytes(32).toString('hex');

        user.virfytoken = verifytoken;

        await this.userrepo.save(user);
        const url = `http://localhost:5000/users/verify-email/${user.id}/${verifytoken}`;

        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Confirm your email',
          html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
        });

        return false;
      }
    } else {
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
  }

  public async verifyUser(id: number, token: string) {
    const user = await this.userrepo.findOne({ where: { id: id } });

    if (user === null)
      throw new NotFoundException(
        'Something went wrong this account is not exist please check if this account has been deleted',
      );

    if (user.virfytoken === null)
      throw new BadRequestException(
        'Something went wrong please try to login again',
      );

    if (user.virfytoken !== token)
      throw new UnauthorizedException(
        'invalid link , try to login again to get new link',
      );

    user.isvalidate = true;
    user.virfytoken = null;

    await this.userrepo.save(user);

    console.log('Account has been validated succsusfully');
    return { message: 'Account has been validated succsusfully' };
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

  /** reset the password */
  public async sendResetPasswordLink(resetpassDTO: ResetPassDTO) {
    const user = await this.userrepo.findOne({
      where: { email: resetpassDTO.email },
    });

    if (!user) throw new NotFoundException();

    if (user.usernmae !== resetpassDTO.usernmae)
      throw new BadRequestException('invalid informations');

    const resetpasstoken = randomBytes(32).toString('hex');

    user.resetpasstoken = resetpasstoken;

    await this.userrepo.save(user);
    const url = `http://localhost:3000/pages/resetpass/${user.id}/${resetpasstoken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
    });

    return { message: 'Email set succsusfully' };
  }

  public async resetThePassword(resetpassinfoDTO: ResetPassInfoDTO) {
    const user = await this.userrepo.findOne({
      where: { id: resetpassinfoDTO.id },
    });
    if (!user) throw new NotFoundException();

    if (user.resetpasstoken === null)
      throw new UnauthorizedException('invalid link try again');

    if (user.resetpasstoken !== resetpassinfoDTO.token)
      throw new UnauthorizedException('invalid link try again');

    user.resetpasstoken = null;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(resetpassinfoDTO.password, salt);
    user.password = hashPassword;

    return this.userrepo.save(user);
  }
}
