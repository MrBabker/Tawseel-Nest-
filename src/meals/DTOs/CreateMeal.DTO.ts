import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateNewMealDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'meal name' })
  name: string;
  @IsNumber()
  @Min(0)
  price: number;
  image: string | null;
  @IsString()
  type: string;
}
