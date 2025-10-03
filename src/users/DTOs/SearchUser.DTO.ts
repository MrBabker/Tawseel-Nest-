import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class SearchUserDTO {
  @IsNumber()
  @ApiProperty({ description: '' })
  id?: number;

  @IsString()
  @ApiProperty({ description: '' })
  usernmae?: string;

  @IsEmail()
  @ApiProperty({ description: '' })
  email?: string;

  @IsString()
  @ApiProperty({ description: '' })
  phonenumber?: string;

  @IsString()
  @ApiProperty({ description: '' })
  location?: string;

  @IsBoolean()
  @ApiProperty({ description: '' })
  isemployee?: boolean;

  @IsString()
  @ApiProperty({ description: '' })
  employeetype?: string;

  @IsBoolean()
  @ApiProperty({ description: '' })
  isvalidate?: boolean;
}
