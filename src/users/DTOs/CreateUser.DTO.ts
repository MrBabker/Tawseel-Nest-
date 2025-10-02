import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: '' })
  usernmae: string;

  @IsEmail()
  @ApiProperty({ description: '' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: '' })
  password: string;

  @IsNumber()
  @ApiProperty({ description: '' })
  phonenumber: string;

  @IsString()
  @ApiProperty({ description: '' })
  location: string;
}
