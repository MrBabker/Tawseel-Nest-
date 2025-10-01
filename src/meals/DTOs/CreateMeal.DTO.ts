import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateNewMealDTO {
  @IsString()
  @ApiProperty({ description: 'meal name' })
  name: string;
  @IsNumber()
  @Min(0)
  price: number;
  image: string | null;
  type: string;
}
