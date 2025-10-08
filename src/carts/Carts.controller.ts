import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PayloadParamDecorator } from 'src/users/decorators/Payload.decorator';
import { AuthUserCookieGuard } from 'src/users/gaurds/AuthUser.guard';
import { JWT_Payload } from 'src/utils';
import { CreateCartDTO } from './DTOs/CreateCart.DTO';
import { CartsServics } from './Carts.service';

@Controller('api/cart')
export class CartsController {
  constructor(private readonly cartservices: CartsServics) {}

  @Post()
  @UseGuards(AuthUserCookieGuard)
  public CreateCart(
    @PayloadParamDecorator() payload: JWT_Payload,
    @Body() createcartDTO: CreateCartDTO,
  ) {
    return this.cartservices.createCart(payload.id, createcartDTO);
  }
}
