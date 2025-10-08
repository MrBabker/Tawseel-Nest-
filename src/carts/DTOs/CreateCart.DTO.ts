import { IsString } from 'class-validator';

export class CreateCartDTO {
  @IsString()
  carttype: string;
}
