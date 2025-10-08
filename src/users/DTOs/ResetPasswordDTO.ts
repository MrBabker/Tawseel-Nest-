import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPassDTO {
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: '' })
  usernmae: string;

  @IsEmail()
  @ApiProperty({ description: '' })
  email: string;
}
