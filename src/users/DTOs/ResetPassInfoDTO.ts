import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class ResetPassInfoDTO {
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: '' })
  password: string;

  @IsNumber()
  @ApiProperty({ description: '' })
  id: number;

  @IsString()
  @ApiProperty({ description: '' })
  token: string;
}
