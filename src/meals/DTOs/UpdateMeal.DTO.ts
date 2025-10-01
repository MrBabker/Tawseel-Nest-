import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateMealDTO {
  @IsString()
  name?: string;
  @IsNumber()
  @Min(0)
  price?: number;
  image?: string | null;
  @IsString()
  type?: string;
}
