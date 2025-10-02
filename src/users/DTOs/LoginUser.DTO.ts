import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  @ApiProperty({ description: '' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: '' })
  password: string;
}
