import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './Carts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCartDTO } from './DTOs/CreateCart.DTO';
import { User } from 'src/users/Users.entites';

@Injectable()
export class CartsServics {
  constructor(
    @InjectRepository(Cart) private readonly cartrepo: Repository<Cart>,
    @InjectRepository(User) private readonly userrepo: Repository<User>,
  ) {}

  public async createCart(userid: number, cartDTO: CreateCartDTO) {
    const myuser = await this.userrepo.findOne({ where: { id: userid } });

    if (!myuser) throw new UnauthorizedException();

    const newCart: Cart = this.cartrepo.create({
      carttype: cartDTO.carttype,
      user: myuser,
    });

    return this.cartrepo.save(newCart);
  }
}
