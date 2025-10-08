import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
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
import { SearchUserDTO } from './DTOs/SearchUser.DTO';
import { AuthUserAdminCookieGuard } from './gaurds/AuthUserAdmin.guard';
import { ResetPassDTO } from './DTOs/ResetPasswordDTO';
import { ResetPassInfoDTO } from './DTOs/ResetPassInfoDTO';

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

    if (access_token === false)
      return {
        message:
          'We have sent virfcation url to your email , please click in the url to virfy your email',
      };

    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'User logged successfully' };
  }

  @Post('out')
  public LogOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
    });

    return { message: 'User logged out successfully' };
  }

  @Get('cur')
  @UseGuards(AuthUserCookieGuard)
  @UseInterceptors(LoggerInterceptor)
  public GetCurrntUser(@PayloadParamDecorator() payload: JWT_Payload) {
    return this.usersservices.getCurrentUser(payload.id);
  }

  @Post('all-users')
  @UseGuards(AuthUserAdminCookieGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  public GetAllUsers(@Body() searchUserDTO: SearchUserDTO) {
    return this.usersservices.getAllUsers(searchUserDTO);
  }

  @Get('verify-email/:id/:token')
  public VerifyUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('token') token: string,
  ) {
    return this.usersservices.verifyUser(id, token);
  }

  /** reset the password */
  @Post('resetpass')
  public SendResetPasswordLink(@Body() resetpassDTO: ResetPassDTO) {
    return this.usersservices.sendResetPasswordLink(resetpassDTO);
  }
  @Post('resetedpass')
  public ResetPassword(@Body() resetpassinfoDTO: ResetPassInfoDTO) {
    return this.usersservices.resetThePassword(resetpassinfoDTO);
  }
}
